import express from 'express';
import multer from 'multer';
import { loginWithOneDrive, oneDriveCallback, uploadMultiplePDFs, sharePDF } from '../controllers/adminController.js';
import { uploadMultiple } from '../middleware/multerMiddleware.js';
const router = express.Router();

router.get('/auth/login', loginWithOneDrive);
router.get('/auth/callback', oneDriveCallback);
router.post('/upload',uploadMultiple,uploadMultiplePDFs);
router.get('/share/:fileId', sharePDF);

export default router;
