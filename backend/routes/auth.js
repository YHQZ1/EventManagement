import express from 'express';
import { 
  register, 
  login, 
  getMe, 
  updateProfile, 
  registerAdmin,
  getAllUsers,
  updateUserRole,
  deleteUser,
  getUserStats
} from '../controllers/authController.js';
import { auth, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/admin/register', registerAdmin);

router.get('/me', auth, getMe);
router.put('/profile', auth, updateProfile);

router.get('/admin/users', auth, admin, getAllUsers);
router.get('/admin/stats', auth, admin, getUserStats);
router.put('/admin/users/:userId/role', auth, admin, updateUserRole);
router.delete('/admin/users/:userId', auth, admin, deleteUser);

export default router;