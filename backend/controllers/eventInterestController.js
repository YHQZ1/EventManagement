import EventInterest from '../models/EventInterest.js';
import Event from '../models/Event.js';
import User from '../models/User.js';

// Mark event as interested
export const markInterested = async (req, res) => {
  try {
    const { eventId } = req.params;
    
    // Check if already interested
    const existingInterest = await EventInterest.findOne({
      event: eventId,
      user: req.user._id
    });

    if (existingInterest) {
      return res.status(400).json({ message: 'Already interested in this event' });
    }

    // Create interest
    const eventInterest = new EventInterest({
      event: eventId,
      user: req.user._id
    });

    await eventInterest.save();

    // Update event's interested users and count
    await Event.findByIdAndUpdate(eventId, {
      $addToSet: { interestedUsers: req.user._id },
      $inc: { interestedCount: 1 }
    });

    // Populate the event interest with user and event details
    await eventInterest.populate('user', 'name email');
    await eventInterest.populate('event', 'title date time location');

    res.json({
      message: 'Marked as interested',
      eventInterest
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Remove interest
export const removeInterest = async (req, res) => {
  try {
    const { eventId } = req.params;

    const eventInterest = await EventInterest.findOneAndDelete({
      event: eventId,
      user: req.user._id
    });

    if (!eventInterest) {
      return res.status(404).json({ message: 'Interest not found' });
    }

    // Update event's interested users and count
    await Event.findByIdAndUpdate(eventId, {
      $pull: { interestedUsers: req.user._id },
      $inc: { interestedCount: -1 }
    });

    res.json({ message: 'Interest removed' });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get interested users for an event (Admin only)
export const getInterestedUsers = async (req, res) => {
  try {
    const { eventId } = req.params;

    const interestedUsers = await EventInterest.find({ event: eventId })
      .populate('user', 'name email phone notificationPreference')
      .populate('event', 'title date time location');

    res.json(interestedUsers);

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Check if user is interested in an event
export const checkUserInterest = async (req, res) => {
  try {
    const { eventId } = req.params;

    const eventInterest = await EventInterest.findOne({
      event: eventId,
      user: req.user._id
    });

    res.json({ isInterested: !!eventInterest });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all events user is interested in
export const getUserInterestedEvents = async (req, res) => {
  try {
    const interestedEvents = await EventInterest.find({ user: req.user._id })
      .populate('event')
      .sort({ createdAt: -1 });

    res.json(interestedEvents);

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};