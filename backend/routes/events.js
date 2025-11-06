import express from 'express';
import {
  createEvent,
  getEvents,
  getEvent,
  updateEvent,
  deleteEvent,
  getEventsByCategory
} from '../controllers/eventController.js';
import { auth, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getEvents);
router.get('/category/:category', getEventsByCategory);
router.get('/:id', getEvent);

// Protected routes (Admin only)
router.post('/', auth, admin, createEvent);
router.put('/:id', auth, admin, updateEvent);
router.delete('/:id', auth, admin, deleteEvent);

export default router;