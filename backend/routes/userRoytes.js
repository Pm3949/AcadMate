import express from 'express';
import { registerUser, loginUser, logoutUser, getMyProfile,getStudyMaterials } from '../controllers/UserController.js';
import isAuthenticated from '../middleware/isAuthenticated.js';

const router = express.Router();

router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.route('/logout').get(logoutUser);
router.route('/me').get(isAuthenticated, getMyProfile);
router.get('/materials', getStudyMaterials);



export default router;