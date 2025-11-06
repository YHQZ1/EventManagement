import express from 'express';
import {
  getAllUsersEmails,
  getInterestedUsersForEmail,
  sendBulkEventNotification
} from '../controllers/emailController.js';
import { auth, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Admin only routes
router.get('/users', auth, admin, getAllUsersEmails);
router.get('/events/:eventId/interested-users', auth, admin, getInterestedUsersForEmail);
router.post('/events/:eventId/send-notification', auth, admin, sendBulkEventNotification);

export default router;