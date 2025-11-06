import Event from "../models/Event.js";

export const createEvent = async (req, res) => {
  try {
    const {
      title,
      description,
      date,
      time,
      location,
      category,
      maxParticipants,
      image,
    } = req.body;

    const event = new Event({
      title,
      description,
      date,
      time,
      location,
      category,
      maxParticipants,
      image,
      createdBy: req.user._id,
    });

    await event.save();

    res.status(201).json({ message: "Event created successfully", event });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getEvents = async (req, res) => {
  try {
    const events = await Event.find({ isActive: true })
      .populate("createdBy", "name email")
      .sort({ date: 1 });

    res.json(events);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate(
      "createdBy",
      "name email"
    );

    if (!event) return res.status(404).json({ message: "Event not found" });

    res.json(event);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const updateEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    }).populate("createdBy", "name email");

    if (!event) return res.status(404).json({ message: "Event not found" });

    res.json({ message: "Event updated successfully", event });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!event) return res.status(404).json({ message: "Event not found" });

    res.json({ message: "Event deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getEventsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const events = await Event.find({
      category,
      isActive: true,
    })
      .populate("createdBy", "name email")
      .sort({ date: 1 });

    res.json(events);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
