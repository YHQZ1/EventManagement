import EventInterest from "../models/EventInterest.js";
import Event from "../models/Event.js";

export const markInterested = async (req, res) => {
  try {
    const { eventId } = req.params;

    const existingInterest = await EventInterest.findOne({
      event: eventId,
      user: req.user._id,
    });

    if (existingInterest) {
      return res
        .status(400)
        .json({ message: "Already interested in this event" });
    }

    const eventInterest = new EventInterest({
      event: eventId,
      user: req.user._id,
    });

    await eventInterest.save();

    await Event.findByIdAndUpdate(eventId, {
      $addToSet: { interestedUsers: req.user._id },
      $inc: { interestedCount: 1 },
    });

    await eventInterest.populate("user", "name email");
    await eventInterest.populate("event", "title date time location");

    res.json({ message: "Marked as interested", eventInterest });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const removeInterest = async (req, res) => {
  try {
    const { eventId } = req.params;

    const eventInterest = await EventInterest.findOneAndDelete({
      event: eventId,
      user: req.user._id,
    });

    if (!eventInterest) {
      return res.status(404).json({ message: "Interest not found" });
    }

    await Event.findByIdAndUpdate(eventId, {
      $pull: { interestedUsers: req.user._id },
      $inc: { interestedCount: -1 },
    });

    res.json({ message: "Interest removed" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getInterestedUsers = async (req, res) => {
  try {
    const { eventId } = req.params;

    const interestedUsers = await EventInterest.find({ event: eventId })
      .populate("user", "name email phone notificationPreference")
      .populate("event", "title date time location");

    res.json(interestedUsers);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const checkUserInterest = async (req, res) => {
  try {
    const { eventId } = req.params;

    const eventInterest = await EventInterest.findOne({
      event: eventId,
      user: req.user._id,
    });

    res.json({ isInterested: !!eventInterest });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getUserInterestedEvents = async (req, res) => {
  try {
    const interestedEvents = await EventInterest.find({ user: req.user._id })
      .populate("event")
      .sort({ createdAt: -1 });

    res.json(interestedEvents);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
