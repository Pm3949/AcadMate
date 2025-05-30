import fs from "fs";
import axios from "axios";
import path from "path";
import StudyMaterial from "../models/Material.js";
import { encrypt } from "../utils/encryption.js";
import { customAlphabet } from "nanoid";
const nanoid = customAlphabet("abcdefghijklmnopqrstuvwxyz0123456789", 10);
const fileSlug = nanoid(); // Example: 'k7g8z1qw'

let access_token = null; // Store securely in DB or session in real apps
import crypto from "crypto";

export const loginWithOneDrive = (req, res) => {
  const verifier = crypto.randomBytes(32).toString("hex");
  const challenge = crypto
    .createHash("sha256")
    .update(verifier)
    .digest("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

  req.session.pkceVerifier = verifier;

  const redirectUrl =
    `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?` +
    `client_id=${process.env.ONEDRIVE_CLIENT_ID}` +
    `&response_type=code` +
    `&redirect_uri=${encodeURIComponent(process.env.ONEDRIVE_REDIRECT_URI)}` +
    `&scope=offline_access Files.ReadWrite.All User.Read` +
    `&code_challenge=${challenge}` +
    `&code_challenge_method=S256`;

  res.redirect(redirectUrl);
};

export const oneDriveCallback = async (req, res) => {
  const { code } = req.query;
  const { pkceVerifier } = req.session;

  if (!code || !pkceVerifier) {
    return res.status(400).send("Authorization code or PKCE verifier missing");
  }

  try {
    const params = new URLSearchParams({
      client_id: process.env.ONEDRIVE_CLIENT_ID,
      client_secret: process.env.ONEDRIVE_CLIENT_SECRET,
      code,
      redirect_uri: process.env.ONEDRIVE_REDIRECT_URI,
      grant_type: "authorization_code",
      code_verifier: pkceVerifier,
    });

    const response = await axios.post(
      "https://login.microsoftonline.com/common/oauth2/v2.0/token",
      params.toString(),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    req.session.accessToken = response.data.access_token;
    req.session.refreshToken = response.data.refresh_token;
    delete req.session.pkceVerifier;

res.redirect(`https://acadmate-admin.onrender.com?accessToken=${response.data.access_token}`);

  } catch (error) {
    console.error("Token error:", error.response?.data || error.message);
    res.status(500).send("Authentication failed");
  }
};


export const uploadMultiplePDFs = async (req, res) => {
  const accessToken = req.session.accessToken;
  const { category, branch, subject } = req.body;

  if (!accessToken) {
    return res.status(401).json({ error: 'Not authorized with OneDrive' });
  }

  if (!category || !branch || !subject) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: 'No files uploaded' });
  }

  const uploadedFiles = [];
  const failedFiles = [];

  for (const file of req.files) {
    const filePath = path.resolve(file.path);
    const fileName = file.originalname;
    const uploadPath = `Study_Mine_material/${category}/${branch}/${subject}/${fileName}`;
    const stream = fs.createReadStream(filePath);

    try {
      const response = await axios.put(
        `https://graph.microsoft.com/v1.0/me/drive/root:/${uploadPath}:/content`,
        stream,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/pdf',
          },
        }
      );

      const encryptedUrl = encrypt(response.data.webUrl);
      const fileSlug = nanoid();

      let categoryDoc = await StudyMaterial.findOne({ category });

      if (!categoryDoc) {
        categoryDoc = await StudyMaterial.create({
          category,
          branches: [
            {
              branch,
              subjects: [
                {
                  subject,
                  files: [
                    {
                      fileName,
                      oneDriveId: response.data.id,
                      webUrl: encryptedUrl,
                      fileSlug,
                    },
                  ],
                },
              ],
            },
          ],
        });
      } else {
        let branchDoc = categoryDoc.branches.find((b) => b.branch === branch);
        if (!branchDoc) {
          categoryDoc.branches.push({
            branch,
            subjects: [
              {
                subject,
                files: [
                  {
                    fileName,
                    oneDriveId: response.data.id,
                    webUrl: encryptedUrl,
                    fileSlug,
                  },
                ],
              },
            ],
          });
        } else {
          let subjectDoc = branchDoc.subjects.find((s) => s.subject === subject);
          if (!subjectDoc) {
            branchDoc.subjects.push({
              subject,
              files: [
                {
                  fileName,
                  oneDriveId: response.data.id,
                  webUrl: encryptedUrl,
                  fileSlug,
                },
              ],
            });
          } else {
            subjectDoc.files.push({
              fileName,
              oneDriveId: response.data.id,
              webUrl: encryptedUrl,
              fileSlug,
            });
          }
        }
        await categoryDoc.save();
      }

      uploadedFiles.push({ fileName, webUrl: encryptedUrl });
    } catch (err) {
      const errorMessage = err.response?.data?.error?.message || err.message || 'Unknown error';
      console.error(`Upload failed for ${fileName}:`, errorMessage);
      failedFiles.push({ fileName, error: errorMessage });
    } finally {
      fs.unlinkSync(filePath);
    }
  }

  if (uploadedFiles.length > 0) {
    res.json({
      success: true,
      files: uploadedFiles,
      failed: failedFiles.length ? failedFiles : undefined,
    });
  } else {
    res.status(500).json({
      success: false,
      error: 'All uploads failed',
      failed: failedFiles,
    });
  }
};
export const sharePDF = async (req, res) => {
  const { fileId } = req.params;
  const { accessToken } = req.session;

  if (!accessToken) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  try {
    const shareResponse = await axios.post(
      `https://graph.microsoft.com/v1.0/me/drive/items/${fileId}/createLink`,
      {
        type: "view",
        scope: "anonymous",
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    const webUrl = shareResponse.data.link.webUrl;
    const officeEmbedUrl = `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(
      webUrl
    )}`;

    res.json({ shareUrl: officeEmbedUrl });
  } catch (err) {
    console.error("Share error:", err.response?.data || err.message);
    res.status(500).json({ error: "Sharing failed" });
  }
};
