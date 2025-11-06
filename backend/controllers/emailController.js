import User from '../models/User.js';
import EventInterest from '../models/EventInterest.js';

// Get all users emails (Admin only)
export const getAllUsersEmails = async (req, res) => {
  try {
    const users = await User.find({}, 'email name');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get interested users for email (Admin only)
export const getInterestedUsersForEmail = async (req, res) => {
  try {
    const { eventId } = req.params;
    
    const interestedUsers = await EventInterest.find({ event: eventId })
      .populate('user', 'email name')
      .populate('event', 'title date time location');

    res.json(interestedUsers);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};