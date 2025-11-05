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

// Public routes
router.post('/register', register);
router.post('/login', login);

// Admin registration (public but should be protected in production)
router.post('/admin/register', registerAdmin);

// Protected routes
router.get('/me', auth, getMe);
router.put('/profile', auth, updateProfile);

// Admin only routes
router.get('/admin/users', auth, admin, getAllUsers);
router.get('/admin/stats', auth, admin, getUserStats);
router.put('/admin/users/:userId/role', auth, admin, updateUserRole);
router.delete('/admin/users/:userId', auth, admin, deleteUser);

export default router;