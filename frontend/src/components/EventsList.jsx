/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Calendar,
  Heart,
  Users,
  MapPin,
  Clock,
  ArrowRight,
  Image as ImageIcon,
  Star,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const API_BASE_URL =
  import.meta.env.VITE_BACKEND_URL || "http://localhost:5001";

const EventsList = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [interestedEvents, setInterestedEvents] = useState(new Set());
  const { user, isAuthenticated } = useAuth();

  // Category icons mapping
  const categoryIcons = {
    kirtan: Calendar,
    festival: Heart,
    study: Users,
    seva: Heart,
    other: Calendar,
  };

  // Category colors mapping
  const categoryColors = {
    kirtan: "from-[#ab5244] to-[#8f4437]",
    festival: "from-orange-400 to-[#ab5244]",
    study: "from-amber-400 to-orange-500",
    seva: "from-green-400 to-emerald-500",
    other: "from-purple-400 to-purple-500",
  };

  useEffect(() => {
    fetchEvents();
    if (isAuthenticated) {
      fetchUserInterests();
    }
  }, [isAuthenticated]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/api/events`);
      setEvents(response.data);
    } catch (error) {
      console.error("Error fetching events:", error);
      setError("Failed to load events");
    } finally {
      setLoading(false);
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
      setInterestedEvents(interestedEventIds);
    } catch (error) {
      console.error("Error fetching user interests:", error);
    }
  };

  const handleInterestToggle = async (eventId) => {
    if (!isAuthenticated) {
      alert("Please login to mark events as interested");
      return;
    }

    try {
      const isCurrentlyInterested = interestedEvents.has(eventId);

      if (isCurrentlyInterested) {
        await axios.delete(
          `${API_BASE_URL}/api/event-interests/${eventId}/interested`
        );
        setInterestedEvents((prev) => {
          const newSet = new Set(prev);
          newSet.delete(eventId);
          return newSet;
        });
      } else {
        await axios.post(
          `${API_BASE_URL}/api/event-interests/${eventId}/interested`
        );
        setInterestedEvents((prev) => new Set(prev).add(eventId));
      }

      // Refresh events to update interested count
      fetchEvents();
    } catch (error) {
      console.error("Error toggling interest:", error);
      alert("Failed to update interest");
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

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse"
          >
            <div className="h-48 bg-gray-300"></div>
            <div className="p-6">
              <div className="h-6 bg-gray-300 rounded mb-2"></div>
              <div className="h-4 bg-gray-300 rounded mb-4"></div>
              <div className="h-4 bg-gray-300 rounded w-3/4"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <Calendar className="mx-auto text-gray-400 mb-4" size={48} />
        <p className="text-gray-500 mb-4">{error}</p>
        <button
          onClick={fetchEvents}
          className="bg-[#ab5244] text-white px-6 py-3 rounded-xl hover:bg-[#8f4437] transition duration-200"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="text-center py-12">
        <Calendar className="mx-auto text-gray-400 mb-4" size={48} />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          No Events Available
        </h3>
        <p className="text-gray-500">Check back later for upcoming events</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {events.map((event) => {
        const IconComponent = categoryIcons[event.category] || Calendar;
        const gradientClass =
          categoryColors[event.category] || "from-[#ab5244] to-[#8f4437]";
        const hasImage = event.image && event.image.trim() !== "";
        const isInterested = interestedEvents.has(event._id);

        return (
          <div
            key={event._id}
            className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 group transform hover:-translate-y-1"
          >
            {/* Image or Gradient Background */}
            <div
              className={`h-48 relative overflow-hidden ${
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
                  {/* Fallback gradient background */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${gradientClass} flex items-center justify-center hidden`}
                  >
                    <IconComponent
                      className="text-white transform group-hover:scale-110 transition-transform duration-300"
                      size={64}
                    />
                  </div>
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <IconComponent
                    className="text-white transform group-hover:scale-110 transition-transform duration-300"
                    size={64}
                  />
                </div>
              )}

              {/* Event status badge */}
              <div className="absolute top-4 right-4">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
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

              {/* Interested count */}
              <div className="absolute bottom-4 left-4">
                <span className="bg-black/30 text-white px-2 py-1 rounded-full text-xs font-semibold">
                  {event.interestedCount || 0} interested
                </span>
              </div>

              {/* Image indicator */}
              {hasImage && (
                <div className="absolute bottom-4 right-4">
                  <span className="bg-black/30 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                    <ImageIcon size={12} />
                    Photo
                  </span>
                </div>
              )}
            </div>

            <div className="p-6">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-xl font-bold text-gray-900 line-clamp-2 group-hover:text-[#ab5244] transition-colors duration-200">
                  {event.title}
                </h3>
              </div>

              <p className="text-gray-600 mb-4 line-clamp-3">
                {event.description}
              </p>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Calendar size={16} />
                  <span>{formatDate(event.date)}</span>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Clock size={16} />
                  <span>{event.time}</span>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <MapPin size={16} />
                  <span className="line-clamp-1">{event.location}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-xs font-semibold">
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
                    <Star
                      size={16}
                      fill={isInterested ? "currentColor" : "none"}
                    />
                    {isInterested ? "Interested" : "Mark Interest"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default EventsList;
