import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import {
  Sparkles,
  User,
  Mail,
  Phone,
  Bell,
  Shield,
  LogOut,
  BarChart3,
  Users,
  UserPlus,
  Crown,
  Trash2,
  Calendar,
  Plus,
  MapPin,
  Clock,
  Heart,
  Image as ImageIcon,
  Star,
  Send,
  Eye,
} from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5001';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [events, setEvents] = useState([]);
  const [eventFormData, setEventFormData] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    category: "kirtan",
    maxParticipants: 0,
    image: "",
  });
  const [interestedUsers, setInterestedUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [emailFormData, setEmailFormData] = useState({
    subject: "",
    message: "",
    eventId: "",
    recipientType: "all",
  });
  const [emailLoading, setEmailLoading] = useState(false);
  const [emailMessage, setEmailMessage] = useState("");
  const [userInterests, setUserInterests] = useState(new Set());

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const categoryIcons = {
    kirtan: Calendar,
    festival: Heart,
    study: Users,
    seva: Heart,
    other: Calendar,
  };

  const categoryColors = {
    kirtan: "from-[#ab5244] to-[#8f4437]",
    festival: "from-orange-400 to-[#ab5244]",
    study: "from-amber-400 to-orange-500",
    seva: "from-green-400 to-emerald-500",
    other: "from-purple-400 to-purple-500",
  };

  useEffect(() => {
    if (user) {
      fetchUserInterests();
    }
  }, [user]);

  useEffect(() => {
    if (!user) {
      navigate("/auth");
    }
  }, [user, navigate]);

  const fetchEvents = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/events`);
      setEvents(response.data);
      if (user) {
        fetchUserInterests();
      }
    } catch {
      setMessage("Failed to fetch events");
    }
  };

  const fetchUserInterests = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/event-interests/user/interested`
      );
      const interestedEventIds = new Set(
        response.data.map((item) => item.event._id)
      );
      setUserInterests(interestedEventIds);
    } catch {
      setMessage("Error fetching user interests");
    }
  };

  const handleInterestToggle = async (eventId) => {
    try {
      const isCurrentlyInterested = userInterests.has(eventId);

      if (isCurrentlyInterested) {
        await axios.delete(
          `${API_BASE_URL}/api/event-interests/${eventId}/interested`
        );
        setUserInterests((prev) => {
          const newSet = new Set(prev);
          newSet.delete(eventId);
          return newSet;
        });
        setMessage("Removed interest from event");
      } else {
        await axios.post(
          `${API_BASE_URL}/api/event-interests/${eventId}/interested`
        );
        setUserInterests((prev) => new Set(prev).add(eventId));
        setMessage("Marked as interested in event");
      }
      fetchEvents();
    } catch {
      setMessage("Failed to update interest");
    }
  };

  const createEvent = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${API_BASE_URL}/api/events`, eventFormData);
      setMessage("Event created successfully!");
      setEventFormData({
        title: "",
        description: "",
        date: "",
        time: "",
        location: "",
        category: "kirtan",
        maxParticipants: 0,
        image: "",
      });
      setActiveTab("events");
      fetchEvents();
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to create event");
    } finally {
      setLoading(false);
    }
  };

  const deleteEvent = async (eventId) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      try {
        await axios.delete(`${API_BASE_URL}/api/events/${eventId}`);
        setMessage("Event deleted successfully");
        fetchEvents();
      } catch (error) {
        setMessage(error.response?.data?.message || "Failed to delete event");
      }
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleEventChange = (e) => {
    setEventFormData({
      ...eventFormData,
      [e.target.name]: e.target.value,
    });
  };

  const fetchAllUsers = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/auth/admin/users`
      );
      setUsers(response.data);
      setActiveTab("users");
    } catch {
      setMessage("Access denied: Admin privileges required");
    }
  };

  const fetchStats = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/auth/admin/stats`
      );
      setStats(response.data);
      setActiveTab("stats");
    } catch  {
      setMessage("Failed to fetch statistics");
    }
  };

  const updateUserRole = async (userId, newRole) => {
    try {
      await axios.put(
        `${API_BASE_URL}/api/auth/admin/users/${userId}/role`,
        { role: newRole }
      );
      setMessage(`User role updated to ${newRole}`);
      fetchAllUsers();
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to update role");
    }
  };

  const deleteUser = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await axios.delete(
          `${API_BASE_URL}/api/auth/admin/users/${userId}`
        );
        setMessage("User deleted successfully");
        fetchAllUsers();
      } catch (error) {
        setMessage(error.response?.data?.message || "Failed to delete user");
      }
    }
  };

  const fetchInterestedUsers = async (eventId) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/event-interests/${eventId}/interested-users`
      );
      setInterestedUsers(response.data);
      setSelectedEvent(eventId);
      setActiveTab("interestedUsers");
    } catch {
      setMessage("Failed to fetch interested users");
    }
  };

  const fetchAllUsersForEmail = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/email/users`);
      setAllUsers(response.data);
      setActiveTab("sendEmail");
    } catch {
      setMessage("Failed to fetch users");
    }
  };

  const handleEmailChange = (e) => {
    setEmailFormData({
      ...emailFormData,
      [e.target.name]: e.target.value,
    });
  };

  const sendEmail = async (e) => {
    e.preventDefault();
    if (!user) {
      setEmailMessage("User not authenticated");
      return;
    }

    setEmailLoading(true);
    setEmailMessage("");

    try {
      let endpoint = "";
      let payload = {};

      if (emailFormData.recipientType === "all") {
        // For now, we'll focus on event-specific emails
        setEmailMessage('Please use "Interested Users" option for now');
        return;
      } else if (
        emailFormData.recipientType === "interested" &&
        emailFormData.eventId
      ) {
        // Use your NEW Resend backend endpoint with full URL
        endpoint = `${API_BASE_URL}/api/email/events/${emailFormData.eventId}/send-notification`;
        payload = {
          subject: emailFormData.subject,
          message: emailFormData.message,
          customMessage: emailFormData.message,
        };
      } else {
        setEmailMessage("Please select an event for interested users");
        return;
      }

      const response = await axios.post(endpoint, payload);
      setEmailMessage(response.data.message || "Emails sent successfully!");

      setEmailFormData({
        subject: "",
        message: "",
        eventId: "",
        recipientType: "all",
      });
    } catch (error) {
      setEmailMessage(error.response?.data?.message || "Failed to send emails");
    } finally {
      setEmailLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getCategoryDisplayName = (category) => {
    const categoryNames = {
      kirtan: "Weekly Kirtan",
      festival: "Festival Celebration",
      study: "Study Group",
      seva: "Seva Opportunity",
      other: "Special Event",
    };
    return categoryNames[category] || category;
  };

  const renderEventCard = (event) => {
    const IconComponent = categoryIcons[event.category] || Calendar;
    const gradientClass =
      categoryColors[event.category] || "from-[#ab5244] to-[#8f4437]";
    const hasImage = event.image && event.image.trim() !== "";
    const isInterested = userInterests.has(event._id);

    return (
      <div
        key={event._id}
        className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 group transform hover:-translate-y-1 border border-orange-200"
      >
        <div
          className={`h-40 relative overflow-hidden ${
            !hasImage ? `bg-gradient-to-br ${gradientClass}` : ""
          }`}
        >
          {hasImage ? (
            <>
              <img
                src={event.image}
                alt={event.title}
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  e.target.style.display = "none";
                  const fallback = e.target.nextSibling;
                  if (fallback) fallback.style.display = "flex";
                }}
              />
              <div
                className={`absolute inset-0 bg-gradient-to-br ${gradientClass} flex items-center justify-center hidden`}
              >
                <IconComponent
                  className="text-white transform group-hover:scale-110 transition-transform duration-300"
                  size={48}
                />
              </div>
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <IconComponent
                className="text-white transform group-hover:scale-110 transition-transform duration-300"
                size={48}
              />
            </div>
          )}

          <div className="absolute top-3 right-3">
            <span
              className={`px-2 py-1 rounded-full text-xs font-semibold ${
                event.status === "upcoming"
                  ? "bg-green-100 text-green-800"
                  : event.status === "ongoing"
                  ? "bg-blue-100 text-blue-800"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
            </span>
          </div>

          <div className="absolute bottom-3 left-3">
            <span className="bg-black/30 text-white px-2 py-1 rounded-full text-xs font-semibold">
              {event.interestedCount || 0} interested
            </span>
          </div>

          {hasImage && (
            <div className="absolute bottom-3 right-3">
              <span className="bg-black/30 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                <ImageIcon size={12} />
                Photo
              </span>
            </div>
          )}
        </div>

        <div className="p-5">
          <div className="flex items-start justify-between mb-3">
            <h3 className="text-lg font-bold text-gray-900 line-clamp-2 group-hover:text-[#ab5244] transition-colors duration-200">
              {event.title}
            </h3>
          </div>

          <p className="text-gray-600 mb-3 line-clamp-2 text-sm">
            {event.description}
          </p>

          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Calendar size={14} />
              <span>{formatDate(event.date)}</span>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Clock size={14} />
              <span>{event.time}</span>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-500">
              <MapPin size={14} />
              <span className="line-clamp-1">{event.location}</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-xs font-semibold">
              {getCategoryDisplayName(event.category)}
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleInterestToggle(event._id)}
                className={`flex items-center gap-1 px-3 py-2 rounded-lg transition duration-200 text-sm font-semibold ${
                  isInterested
                    ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <Star size={16} fill={isInterested ? "currentColor" : "none"} />
                {isInterested ? "Interested" : "Mark Interest"}
              </button>

              <button
                onClick={() => fetchInterestedUsers(event._id)}
                className="flex items-center gap-1 bg-blue-100 text-blue-700 px-2 py-1 rounded-lg hover:bg-blue-200 transition duration-200 text-xs"
              >
                <Eye size={12} />
                View
              </button>
              <button
                onClick={() => deleteEvent(event._id)}
                className="flex items-center gap-1 bg-red-100 text-red-700 px-2 py-1 rounded-lg hover:bg-red-200 transition duration-200 text-xs"
              >
                <Trash2 size={12} />
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-stone-50 to-orange-100 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#ab5244] opacity-5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-300 opacity-10 rounded-full blur-3xl"></div>

      <div className="relative">
        <header className="bg-white/80 backdrop-blur-md border-b border-orange-200/50 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-6">
                <div className="flex items-center gap-3">
                  <img 
    src="./public/iskcon_logo.jpg" // or your logo path
    alt="ISKCON Logo"
    className="w-12 h-12 object-contain"
  />
                  <h1 className="text-2xl font-bold text-gray-900">
                    ISKCON Admin Dashboard
                  </h1>
                </div>
                <div className="px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 bg-red-100 text-red-800 border border-red-200">
                  <Crown size={16} />
                  ADMIN
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-sm text-gray-600">Welcome back</p>
                  <p className="font-semibold text-gray-900">{user.name}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="bg-[#ab5244] text-white px-4 py-2 rounded-xl hover:bg-[#8f4437] flex items-center gap-2 transition duration-200 shadow-lg hover:shadow-xl"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </header>

        <div className="bg-white/60 backdrop-blur-sm border-b border-orange-200/30">
          <div className="max-w-7xl mx-auto">
            <nav className="flex space-x-1 p-2">
              <button
                onClick={() => setActiveTab("profile")}
                className={`flex items-center gap-2 py-3 px-6 rounded-xl font-medium text-sm transition duration-200 ${
                  activeTab === "profile"
                    ? "bg-[#ab5244] text-white shadow-lg"
                    : "text-gray-600 hover:text-[#ab5244] hover:bg-white/50"
                }`}
              >
                <User size={18} />
                My Profile
              </button>

              <button
                onClick={() => {
                  setActiveTab("events");
                  fetchEvents();
                }}
                className={`flex items-center gap-2 py-3 px-6 rounded-xl font-medium text-sm transition duration-200 ${
                  activeTab === "events"
                    ? "bg-[#ab5244] text-white shadow-lg"
                    : "text-gray-600 hover:text-[#ab5244] hover:bg-white/50"
                }`}
              >
                <Calendar size={18} />
                Manage Events
              </button>

              <button
                onClick={() => {
                  setActiveTab("stats");
                  fetchStats();
                }}
                className={`flex items-center gap-2 py-3 px-6 rounded-xl font-medium text-sm transition duration-200 ${
                  activeTab === "stats"
                    ? "bg-[#ab5244] text-white shadow-lg"
                    : "text-gray-600 hover:text-[#ab5244] hover:bg-white/50"
                }`}
              >
                <BarChart3 size={18} />
                Statistics
              </button>

              <button
                onClick={fetchAllUsers}
                className={`flex items-center gap-2 py-3 px-6 rounded-xl font-medium text-sm transition duration-200 ${
                  activeTab === "users"
                    ? "bg-[#ab5244] text-white shadow-lg"
                    : "text-gray-600 hover:text-[#ab5244] hover:bg-white/50"
                }`}
              >
                <Users size={18} />
                Manage Users
              </button>

              <button
                onClick={() => setActiveTab("createEvent")}
                className={`flex items-center gap-2 py-3 px-6 rounded-xl font-medium text-sm transition duration-200 ${
                  activeTab === "createEvent"
                    ? "bg-[#ab5244] text-white shadow-lg"
                    : "text-gray-600 hover:text-[#ab5244] hover:bg-white/50"
                }`}
              >
                <Plus size={18} />
                Create Event
              </button>

              <button
                onClick={fetchAllUsersForEmail}
                className={`flex items-center gap-2 py-3 px-6 rounded-xl font-medium text-sm transition duration-200 ${
                  activeTab === "sendEmail"
                    ? "bg-[#ab5244] text-white shadow-lg"
                    : "text-gray-600 hover:text-[#ab5244] hover:bg-white/50"
                }`}
              >
                <Send size={18} />
                Send Email
              </button>
            </nav>
          </div>
        </div>

        <main className="max-w-7xl mx-auto py-8 px-4">
          {message && (
            <div
              className={`mb-8 p-4 rounded-xl border ${
                message.includes("successful") || message.includes("updated")
                  ? "bg-green-50 text-green-700 border-green-200"
                  : "bg-red-50 text-red-700 border-red-200"
              }`}
            >
              <div className="flex items-center justify-between">
                <p className="font-medium">{message}</p>
                <button
                  onClick={() => setMessage("")}
                  className="text-current hover:opacity-70"
                >
                  ×
                </button>
              </div>
            </div>
          )}

          {activeTab === "profile" && (
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8">
              <div className="flex items-center gap-3 mb-8">
                <User className="text-[#ab5244]" size={32} />
                <h2 className="text-3xl font-bold text-gray-900">
                  Admin Profile
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-orange-50 to-stone-50 p-6 rounded-2xl border border-orange-200">
                    <User className="text-[#ab5244] mb-3" size={24} />
                    <label className="block text-sm font-medium text-gray-700">
                      Name
                    </label>
                    <p className="mt-1 text-xl font-semibold text-gray-900">
                      {user.name}
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-orange-50 to-stone-50 p-6 rounded-2xl border border-orange-200">
                    <Mail className="text-[#ab5244] mb-3" size={24} />
                    <label className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <p className="mt-1 text-xl font-semibold text-gray-900">
                      {user.email}
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-orange-50 to-stone-50 p-6 rounded-2xl border border-orange-200">
                    <Shield className="text-[#ab5244] mb-3" size={24} />
                    <label className="block text-sm font-medium text-gray-700">
                      Role
                    </label>
                    <p className="mt-1 text-xl font-semibold text-gray-900 capitalize">
                      {user.role}
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-orange-50 to-stone-50 p-6 rounded-2xl border border-orange-200">
                    <Bell className="text-[#ab5244] mb-3" size={24} />
                    <label className="block text-sm font-medium text-gray-700">
                      Notification Preference
                    </label>
                    <p className="mt-1 text-xl font-semibold text-gray-900 capitalize">
                      {user.notificationPreference}
                    </p>
                  </div>

                  {user.phone && (
                    <div className="bg-gradient-to-br from-orange-50 to-stone-50 p-6 rounded-2xl border border-orange-200">
                      <Phone className="text-[#ab5244] mb-3" size={24} />
                      <label className="block text-sm font-medium text-gray-700">
                        Phone
                      </label>
                      <p className="mt-1 text-xl font-semibold text-gray-900">
                        {user.phone}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === "events" && (
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8">
              <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-3">
                  <Calendar className="text-[#ab5244]" size={32} />
                  <h2 className="text-3xl font-bold text-gray-900">
                    Manage Events
                  </h2>
                </div>
                <span className="bg-orange-100 text-orange-800 px-4 py-2 rounded-full font-semibold">
                  {events.length} events
                </span>
              </div>

              {events.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {events.map(renderEventCard)}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Calendar className="mx-auto text-gray-400 mb-4" size={48} />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    No Events Available
                  </h3>
                  <p className="text-gray-500 mb-4">
                    Create your first event to get started
                  </p>
                  <button
                    onClick={() => setActiveTab("createEvent")}
                    className="bg-[#ab5244] text-white px-6 py-3 rounded-xl hover:bg-[#8f4437] transition duration-200"
                  >
                    Create Your First Event
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === "createEvent" && (
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8">
              <div className="flex items-center gap-3 mb-8">
                <Plus className="text-[#ab5244]" size={32} />
                <h2 className="text-3xl font-bold text-gray-900">
                  Create New Event
                </h2>
              </div>

              <form onSubmit={createEvent} className="max-w-4xl space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Event Title
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={eventFormData.title}
                      onChange={handleEventChange}
                      className="w-full border border-gray-300 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-[#ab5244] focus:border-transparent transition"
                      required
                      placeholder="Enter event title"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={eventFormData.description}
                      onChange={handleEventChange}
                      rows="4"
                      className="w-full border border-gray-300 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-[#ab5244] focus:border-transparent transition"
                      required
                      placeholder="Enter event description"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date
                    </label>
                    <input
                      type="date"
                      name="date"
                      value={eventFormData.date}
                      onChange={handleEventChange}
                      className="w-full border border-gray-300 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-[#ab5244] focus:border-transparent transition"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Time
                    </label>
                    <input
                      type="time"
                      name="time"
                      value={eventFormData.time}
                      onChange={handleEventChange}
                      className="w-full border border-gray-300 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-[#ab5244] focus:border-transparent transition"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Location
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={eventFormData.location}
                      onChange={handleEventChange}
                      className="w-full border border-gray-300 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-[#ab5244] focus:border-transparent transition"
                      required
                      placeholder="Enter event location"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <select
                      name="category"
                      value={eventFormData.category}
                      onChange={handleEventChange}
                      className="w-full border border-gray-300 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-[#ab5244] focus:border-transparent transition bg-white"
                    >
                      <option value="kirtan">Weekly Kirtan</option>
                      <option value="festival">Festival Celebration</option>
                      <option value="study">Study Group</option>
                      <option value="seva">Seva Opportunity</option>
                      <option value="other">Special Event</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Max Participants (0 for unlimited)
                    </label>
                    <input
                      type="number"
                      name="maxParticipants"
                      value={eventFormData.maxParticipants}
                      onChange={handleEventChange}
                      className="w-full border border-gray-300 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-[#ab5244] focus:border-transparent transition"
                      min="0"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Image URL (optional)
                    </label>
                    <input
                      type="url"
                      name="image"
                      value={eventFormData.image}
                      onChange={handleEventChange}
                      className="w-full border border-gray-300 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-[#ab5244] focus:border-transparent transition"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-[#ab5244] text-white py-3 px-6 rounded-xl hover:bg-[#8f4437] transition duration-200 disabled:opacity-50 font-semibold flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Creating Event...
                      </>
                    ) : (
                      <>
                        <Plus size={20} />
                        Create Event
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab("events")}
                    className="bg-gray-500 text-white py-3 px-6 rounded-xl hover:bg-gray-600 transition duration-200 font-semibold"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === "stats" && (
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8">
              <div className="flex items-center gap-3 mb-8">
                <BarChart3 className="text-[#ab5244]" size={32} />
                <h2 className="text-3xl font-bold text-gray-900">
                  System Statistics
                </h2>
              </div>

              {stats ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6">
                  <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-2xl border border-blue-200 shadow-lg">
                    <Users className="text-blue-600 mb-3" size={32} />
                    <div className="text-sm font-medium text-blue-800">
                      Total Users
                    </div>
                    <div className="text-3xl font-bold text-blue-900 mt-2">
                      {stats.totalUsers}
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-red-50 to-pink-50 p-6 rounded-2xl border border-red-200 shadow-lg">
                    <Crown className="text-red-600 mb-3" size={32} />
                    <div className="text-sm font-medium text-red-800">
                      Admin Users
                    </div>
                    <div className="text-3xl font-bold text-red-900 mt-2">
                      {stats.adminUsers}
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-2xl border border-green-200 shadow-lg">
                    <User className="text-green-600 mb-3" size={32} />
                    <div className="text-sm font-medium text-green-800">
                      Regular Users
                    </div>
                    <div className="text-3xl font-bold text-green-900 mt-2">
                      {stats.regularUsers}
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-purple-50 to-violet-50 p-6 rounded-2xl border border-purple-200 shadow-lg">
                    <Bell className="text-purple-600 mb-3" size={32} />
                    <div className="text-sm font-medium text-purple-800">
                      Notifications
                    </div>
                    <div className="mt-3 space-y-2">
                      {stats.notificationStats?.map((stat) => (
                        <div
                          key={stat._id}
                          className="flex justify-between items-center text-sm"
                        >
                          <span className="text-purple-900 capitalize">
                            {stat._id}:
                          </span>
                          <span className="font-bold text-purple-900">
                            {stat.count}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <BarChart3 className="mx-auto text-gray-400 mb-4" size={48} />
                  <p className="text-gray-500 mb-4">No statistics loaded yet</p>
                  <button
                    onClick={fetchStats}
                    className="bg-[#ab5244] text-white px-6 py-3 rounded-xl hover:bg-[#8f4437] transition duration-200 shadow-lg hover:shadow-xl"
                  >
                    Load Statistics
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === "users" && (
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8">
              <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-3">
                  <Users className="text-[#ab5244]" size={32} />
                  <h2 className="text-3xl font-bold text-gray-900">
                    Manage Users
                  </h2>
                </div>
                <span className="bg-orange-100 text-orange-800 px-4 py-2 rounded-full font-semibold">
                  {users.length} users
                </span>
              </div>

              {users.length > 0 ? (
                <div className="overflow-hidden rounded-2xl border border-orange-200 shadow-lg">
                  <table className="min-w-full divide-y divide-orange-200">
                    <thead className="bg-gradient-to-r from-orange-50 to-stone-50">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 uppercase">
                          User
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 uppercase">
                          Email
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 uppercase">
                          Role
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 uppercase">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-orange-100">
                      {users.map((userItem) => (
                        <tr
                          key={userItem._id}
                          className="hover:bg-orange-50/50 transition duration-150"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gradient-to-br from-[#ab5244] to-[#8f4437] rounded-full flex items-center justify-center text-white font-semibold">
                                {userItem.name.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <p className="font-semibold text-gray-900">
                                  {userItem.name}
                                  {userItem._id === user._id && (
                                    <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                                      You
                                    </span>
                                  )}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {userItem.email}
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                                userItem.role === "admin"
                                  ? "bg-red-100 text-red-800 border border-red-200"
                                  : "bg-blue-100 text-blue-800 border border-blue-200"
                              }`}
                            >
                              {userItem.role === "admin" && <Crown size={12} />}
                              {userItem.role}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            {userItem._id !== user._id && (
                              <div className="flex items-center gap-2">
                                {userItem.role === "user" ? (
                                  <button
                                    onClick={() =>
                                      updateUserRole(userItem._id, "admin")
                                    }
                                    className="flex items-center gap-1 bg-green-100 text-green-700 px-3 py-2 rounded-lg hover:bg-green-200 transition duration-200"
                                  >
                                    <Crown size={14} />
                                    Make Admin
                                  </button>
                                ) : (
                                  <button
                                    onClick={() =>
                                      updateUserRole(userItem._id, "user")
                                    }
                                    className="flex items-center gap-1 bg-orange-100 text-orange-700 px-3 py-2 rounded-lg hover:bg-orange-200 transition duration-200"
                                  >
                                    <User size={14} />
                                    Make User
                                  </button>
                                )}
                                <button
                                  onClick={() => deleteUser(userItem._id)}
                                  className="flex items-center gap-1 bg-red-100 text-red-700 px-3 py-2 rounded-lg hover:bg-red-200 transition duration-200"
                                >
                                  <Trash2 size={14} />
                                  Delete
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Users className="mx-auto text-gray-400 mb-4" size={48} />
                  <p className="text-gray-500 mb-4">No users loaded yet</p>
                  <button
                    onClick={fetchAllUsers}
                    className="bg-[#ab5244] text-white px-6 py-3 rounded-xl hover:bg-[#8f4437] transition duration-200 shadow-lg hover:shadow-xl"
                  >
                    Load Users
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === "interestedUsers" && (
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8">
              <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-3">
                  <Users className="text-[#ab5244]" size={32} />
                  <h2 className="text-3xl font-bold text-gray-900">
                    Interested Users
                  </h2>
                </div>
                <div className="flex items-center gap-4">
                  <span className="bg-orange-100 text-orange-800 px-4 py-2 rounded-full font-semibold">
                    {interestedUsers.length} users interested
                  </span>
                  <button
                    onClick={() => {
                      setEmailFormData({
                        subject: "",
                        message: "",
                        eventId: selectedEvent,
                        recipientType: "interested",
                      });
                      setActiveTab("sendEmail");
                    }}
                    className="bg-[#ab5244] text-white px-4 py-2 rounded-xl hover:bg-[#8f4437] flex items-center gap-2 transition duration-200"
                  >
                    <Send size={18} />
                    Email Interested Users
                  </button>
                </div>
              </div>

              {interestedUsers.length > 0 ? (
                <div className="overflow-hidden rounded-2xl border border-orange-200 shadow-lg">
                  <table className="min-w-full divide-y divide-orange-200">
                    <thead className="bg-gradient-to-r from-orange-50 to-stone-50">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 uppercase">
                          User
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 uppercase">
                          Email
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 uppercase">
                          Phone
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 uppercase">
                          Notification Preference
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 uppercase">
                          Interested Since
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-orange-100">
                      {interestedUsers.map((interest) => (
                        <tr
                          key={interest._id}
                          className="hover:bg-orange-50/50 transition duration-150"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gradient-to-br from-[#ab5244] to-[#8f4437] rounded-full flex items-center justify-center text-white font-semibold">
                                {interest.user.name.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <p className="font-semibold text-gray-900">
                                  {interest.user.name}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {interest.user.email}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {interest.user.phone || "N/A"}
                          </td>
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-semibold capitalize">
                              {interest.user.notificationPreference}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            {new Date(interest.createdAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Users className="mx-auto text-gray-400 mb-4" size={48} />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    No Interested Users
                  </h3>
                  <p className="text-gray-500">
                    No users have marked interest in this event yet.
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === "sendEmail" && (
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8">
              <div className="flex items-center gap-3 mb-8">
                <Send className="text-[#ab5244]" size={32} />
                <h2 className="text-3xl font-bold text-gray-900">Send Email</h2>
              </div>

              {emailMessage && (
                <div
                  className={`mb-6 p-4 rounded-xl border ${
                    emailMessage.includes("successful")
                      ? "bg-green-50 text-green-700 border-green-200"
                      : "bg-red-50 text-red-700 border-red-200"
                  }`}
                >
                  <p className="font-medium">{emailMessage}</p>
                </div>
              )}

              <form onSubmit={sendEmail} className="max-w-4xl space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Recipient Type
                    </label>
                    <select
                      name="recipientType"
                      value={emailFormData.recipientType}
                      onChange={handleEmailChange}
                      className="w-full border border-gray-300 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-[#ab5244] focus:border-transparent transition bg-white"
                    >
                      <option value="all">
                        All Users ({allUsers.length} users)
                      </option>
                      <option value="interested" disabled={!selectedEvent}>
                        Interested Users ({interestedUsers.length} users)
                        {!selectedEvent && " - Select an event first"}
                      </option>
                    </select>
                  </div>

                  {emailFormData.recipientType === "interested" && (
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Select Event
                      </label>
                      <select
                        name="eventId"
                        value={emailFormData.eventId}
                        onChange={handleEmailChange}
                        className="w-full border border-gray-300 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-[#ab5244] focus:border-transparent transition bg-white"
                      >
                        <option value="">Select an event</option>
                        {events.map((event) => (
                          <option key={event._id} value={event._id}>
                            {event.title} ({event.interestedCount || 0}{" "}
                            interested)
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subject
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={emailFormData.subject}
                      onChange={handleEmailChange}
                      className="w-full border border-gray-300 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-[#ab5244] focus:border-transparent transition"
                      required
                      placeholder="Enter email subject"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Message
                    </label>
                    <textarea
                      name="message"
                      value={emailFormData.message}
                      onChange={handleEmailChange}
                      rows="8"
                      className="w-full border border-gray-300 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-[#ab5244] focus:border-transparent transition"
                      required
                      placeholder="Enter your message here..."
                    />
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    type="submit"
                    disabled={emailLoading}
                    className="bg-[#ab5244] text-white py-3 px-6 rounded-xl hover:bg-[#8f4437] transition duration-200 disabled:opacity-50 font-semibold flex items-center justify-center gap-2"
                  >
                    {emailLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Sending Emails...
                      </>
                    ) : (
                      <>
                        <Send size={20} />
                        Send Email
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab("events")}
                    className="bg-gray-500 text-white py-3 px-6 rounded-xl hover:bg-gray-600 transition duration-200 font-semibold"
                  >
                    Cancel
                  </button>
                </div>
              </form>

              <div className="mt-8 p-6 bg-orange-50 rounded-xl border border-orange-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Recipient Preview
                </h3>
                <p className="text-gray-600">
                  This email will be sent to{" "}
                  <span className="font-semibold">
                    {emailFormData.recipientType === "all"
                      ? `all ${allUsers.length} users`
                      : `${interestedUsers.length} interested users`}
                  </span>
                  {emailFormData.recipientType === "interested" &&
                    emailFormData.eventId && (
                      <span> for the selected event</span>
                    )}
                  .
                </p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;