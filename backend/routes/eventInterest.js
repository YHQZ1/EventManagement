import express from 'express';
import {
  markInterested,
  removeInterest,
  getInterestedUsers,
  checkUserInterest,
  getUserInterestedEvents
} from '../controllers/eventInterestController.js';
import { auth, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// User routes
router.post('/:eventId/interested', auth, markInterested);
router.delete('/:eventId/interested', auth, removeInterest);
router.get('/:eventId/check-interest', auth, checkUserInterest);
router.get('/user/interested', auth, getUserInterestedEvents);

// Admin routes
router.get('/:eventId/interested-users', auth, admin, getInterestedUsers);

export default router;