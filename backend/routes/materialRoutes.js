import express from "express";
import {
  getAllCategories,
  getBranchesByCategory,
  getFilesBySubject,
  getSubjectsByBranch,
  viewFileBySlug,
  downloadFileBySlug,
  saveFile,
  sharePDF,
} from "../controllers/studyMaterialController.js";
import isAuthenticated from "../middleware/isAuthenticated.js";

const router = express.Router();

router.get("/categories", getAllCategories);
router.get("/:category/branches", getBranchesByCategory);
router.get("/:category/:branch/subjects", getSubjectsByBranch);
router.get("/:category/:branch/:subject/files", getFilesBySubject);
router.get("/view/:fileSlug", viewFileBySlug);
router.get("/download/:fileSlug", downloadFileBySlug);
router.get("/sharePDF/:fileId", sharePDF);
router.post("/save",isAuthenticated, saveFile);

export default router;
