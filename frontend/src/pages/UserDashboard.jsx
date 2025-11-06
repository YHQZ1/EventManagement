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
  Calendar,
  MapPin,
  Clock,
  Heart,
  Image as ImageIcon,
  Star,
} from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5001';

const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [events, setEvents] = useState([]);
  const [message, setMessage] = useState("");
  const [userInterests, setUserInterests] = useState(new Set());

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const categoryIcons = {
    kirtan: Calendar,
    festival: Heart,
    study: User,
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

  const handleLogout = () => {
    localStorage.removeItem('token')
    logout();
    navigate("/");
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
                    ISKCON Dashboard
                  </h1>
                </div>
                <div className="px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 bg-blue-100 text-blue-800 border border-blue-200">
                  USER
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
                Events
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
                  User Profile
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
                    Upcoming Events
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
                    Check back later for upcoming events
                  </p>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default UserDashboard;