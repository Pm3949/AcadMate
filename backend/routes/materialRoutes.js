import express from 'express';
import {
  getAllBranches,
  getSubjectsByBranch,
  getFilesBySubject,
  viewFileBySlug,
  downloadFileBySlug
} from '../controllers/materialController.js';

const router = express.Router();

router.get('/branches', getAllBranches);
router.get('/view/:fileSlug', viewFileBySlug); 
router.get('/download/:fileSlug', downloadFileBySlug);
router.get('/:branch', getSubjectsByBranch);
router.get('/:branch/:subject', getFilesBySubject);

export default router;
