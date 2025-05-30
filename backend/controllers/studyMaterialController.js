import StudyMaterial from "../models/Material.js";
import { decrypt } from "../utils/encryption.js";
import User from "../models/user.js";
import axios from "axios";

// GET /api/materials/categories
export const getAllCategories = async (req, res) => {
  try {
    const categories = await StudyMaterial.find().select("category");
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: "Server error fetching categories" });
  }
};

// GET /api/materials/:category/branches
export const getBranchesByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const found = await StudyMaterial.findOne({ category });

    if (!found) return res.status(404).json({ message: "Category not found" });

    res.json(found.branches.map((b) => ({ branch: b.branch })));
  } catch (err) {
    res.status(500).json({ message: "Server error fetching branches" });
  }
};

// GET /api/materials/:category/:branch/subjects
export const getSubjectsByBranch = async (req, res) => {
  try {
    const { category, branch } = req.params;
    const found = await StudyMaterial.findOne({ category });

    if (!found) return res.status(404).json({ message: "Category not found" });

    const branchData = found.branches.find((b) => b.branch === branch);
    if (!branchData)
      return res.status(404).json({ message: "Branch not found" });

    res.json(branchData.subjects.map((s) => ({ subject: s.subject })));
  } catch (err) {
    res.status(500).json({ message: "Server error fetching subjects" });
  }
};

// GET /api/materials/:category/:branch/:subject/files
export const getFilesBySubject = async (req, res) => {
  try {
    const { category, branch, subject } = req.params;
    const found = await StudyMaterial.findOne({ category });

    if (!found) return res.status(404).json({ message: "Category not found" });

    const branchData = found.branches.find((b) => b.branch === branch);
    if (!branchData)
      return res.status(404).json({ message: "Branch not found" });

    const subjectData = branchData.subjects.find((s) => s.subject === subject);
    if (!subjectData)
      return res.status(404).json({ message: "Subject not found" });

    res.json(subjectData.files);
  } catch (err) {
    res.status(500).json({ message: "Server error fetching files" });
  }
};

// GET /api/materials/view/:fileSlug
export const viewFileBySlug = async (req, res) => {
  try {
    const { fileSlug } = req.params;

    const materials = await StudyMaterial.find({}, 'branches.subjects.files').lean();

    let targetFile = null;

    for (const category of materials) {
      for (const branch of category.branches) {
        for (const subject of branch.subjects) {
          targetFile = subject.files.find((f) => f.fileSlug === fileSlug);
          if (targetFile) break;
        }
        if (targetFile) break;
      }
      if (targetFile) break;
    }

    if (!targetFile) {
      return res.status(404).json({ message: "File not found" });
    }

    let decryptedUrl;
    try {
      decryptedUrl = decrypt(targetFile.webUrl);
    } catch (decryptErr) {
      console.error("Decryption error:", decryptErr.message);
      return res.status(400).json({ message: "Invalid file URL" });
    }

    if (!/^https?:\/\//i.test(decryptedUrl)) {
      console.error("Invalid redirect URL format:", decryptedUrl);
      return res.status(400).json({ message: "Decrypted URL is not valid" });
    }

    return res.redirect(decryptedUrl);
  } catch (error) {
    console.error("Error redirecting to file:", error.message);
    return res
      .status(500)
      .json({ message: "Internal server error during file access" });
  }
};


// GET /api/materials/download/:fileSlug
export const downloadFileBySlug = async (req, res) => {
  try {
    const { fileSlug } = req.params;

    const materials = await StudyMaterial.find().lean();

    let targetFile = null;

    for (const category of materials) {
      for (const branch of category.branches) {
        for (const subject of branch.subjects) {
          const found = subject.files.find((f) => f.fileSlug === fileSlug);
          if (found) {
            targetFile = found;
            break;
          }
        }
        if (targetFile) break;
      }
      if (targetFile) break;
    }

    if (!targetFile) return res.status(404).json({ message: "File not found" });

    const decryptedUrl = decrypt(targetFile.webUrl);
    return res.redirect(`${decryptedUrl}?download=1`);
  } catch (error) {
    console.error("Error redirecting to download:", error.message);
    return res
      .status(500)
      .json({ message: "Internal server error during download" });
  }
};

// Helper function to find file in nested structure
const findFileInStructure = async (fileId) => {
  const category = await StudyMaterial.findOne({
    "branches.subjects.files._id": fileId,
  });

  if (!category) return null;

  for (const branch of category.branches) {
    for (const subject of branch.subjects) {
      const foundFile = subject.files.id(fileId);
      if (foundFile) return foundFile;
    }
  }
  return null;
};

// Save a file to user profile
export const saveFile = async (req, res) => {
  const { fileId } = req.body;

  if (!fileId) {
    return res.status(400).json({ message: "File ID required" });
  }

  try {
    const foundFile = await findFileInStructure(fileId);
    if (!foundFile) {
      return res.status(404).json({ message: "File not found" });
    }

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.files) {
      user.files = [];
    }

    const alreadySaved = user.files.some(
      (f) => f.oneDriveId === foundFile.oneDriveId
    );

    if (alreadySaved) {
      return res.status(400).json({ message: "File already saved" });
    }

    user.files.push({
      fileName: foundFile.fileName,
      oneDriveId: foundFile.oneDriveId,
      webUrl: foundFile.webUrl,
      fileSlug: foundFile.fileSlug,
    });

    await user.save();

    res.status(200).json({ message: "File saved to profile" });
  } catch (err) {
    console.error("Save error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
