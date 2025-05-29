import Branch from '../models/pdf.js'; // adjust path as needed
import { decrypt } from '../utils/encryption.js';
import axios from 'axios';



// GET /api/materials/branches
export const getAllBranches = async (req, res) => {
  try {
    const branches = await Branch.find().select('branch');
    res.json(branches);
  } catch (err) {
    res.status(500).json({ message: 'Server error fetching branches' });
  }
};

// GET /api/materials/:branch
export const getSubjectsByBranch = async (req, res) => {
  try {
    const { branch } = req.params;
    const found = await Branch.findOne({ branch });

    if (!found) return res.status(404).json({ message: 'Branch not found' });

    res.json(found.subjects.map(s => ({ subject: s.subject })));
  } catch (err) {
    res.status(500).json({ message: 'Server error fetching subjects' });
  }
};

// GET /api/materials/:branch/:subject
export const getFilesBySubject = async (req, res) => {
  try {
    const { branch, subject } = req.params;
    const found = await Branch.findOne({ branch });

    if (!found) return res.status(404).json({ message: 'Branch not found' });

    const subjectData = found.subjects.find(s => s.subject === subject);
    if (!subjectData) return res.status(404).json({ message: 'Subject not found' });

    res.json(subjectData.files);
  } catch (err) {
    res.status(500).json({ message: 'Server error fetching files' });
  }
};

export const viewFileBySlug = async (req, res) => {
  try {
    const { fileSlug } = req.params;

    const branchDoc = await Branch.findOne({
      subjects: {
        $elemMatch: {
          files: {
            $elemMatch: { fileSlug }
          }
        }
      }
    }).lean();

    if (!branchDoc) return res.status(404).json({ message: 'Branch not found' });

    let targetFile = null;
    for (const subject of branchDoc.subjects) {
      const found = subject.files.find(f => f.fileSlug === fileSlug);
      if (found) {
        targetFile = found;
        break;
      }
    }

    if (!targetFile) return res.status(404).json({ message: 'File not found' });

    const decryptedUrl = decrypt(targetFile.webUrl);

    // ✅ Simply redirect to the file URL
    return res.redirect(decryptedUrl);
  } catch (error) {
    console.error('Error redirecting to file:', error.message);
    return res.status(500).json({ message: 'Internal server error during file access' });
  }
};

// GET /api/materials/download/:fileSlug
export const downloadFileBySlug = async (req, res) => {
  try {
    const { fileSlug } = req.params;

    const branchDoc = await Branch.findOne({
      subjects: {
        $elemMatch: {
          files: {
            $elemMatch: { fileSlug }
          }
        }
      }
    }).lean();

    if (!branchDoc) return res.status(404).json({ message: 'Branch not found' });

    let targetFile = null;
    for (const subject of branchDoc.subjects) {
      const found = subject.files.find(f => f.fileSlug === fileSlug);
      if (found) {
        targetFile = found;
        break;
      }
    }

    if (!targetFile) return res.status(404).json({ message: 'File not found' });

    const decryptedUrl = decrypt(targetFile.webUrl);

    // ✅ Redirect browser to download the file
    return res.redirect(`${decryptedUrl}?download=1`);
  } catch (error) {
    console.error('Error redirecting to download:', error.message);
    return res.status(500).json({ message: 'Internal server error during download' });
  }
};