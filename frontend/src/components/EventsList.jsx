import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, Heart, Users, MapPin, Clock, ArrowRight } from 'lucide-react';

const EventsList = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Category icons mapping
  const categoryIcons = {
    kirtan: Calendar,
    festival: Heart,
    study: Users,
    seva: Heart,
    other: Calendar
  };

  // Category colors mapping
  const categoryColors = {
    kirtan: 'from-[#ab5244] to-[#8f4437]',
    festival: 'from-orange-400 to-[#ab5244]',
    study: 'from-amber-400 to-orange-500',
    seva: 'from-green-400 to-emerald-500',
    other: 'from-purple-400 to-purple-500'
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5001/api/events');
      setEvents(response.data);
    } catch (error) {
      console.error('Error fetching events:', error);
      setError('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getCategoryDisplayName = (category) => {
    const categoryNames = {
      kirtan: 'Weekly Kirtan',
      festival: 'Festival Celebration',
      study: 'Study Group',
      seva: 'Seva Opportunity',
      other: 'Special Event'
    };
    return categoryNames[category] || category;
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[1, 2, 3].map((item) => (
          <div key={item} className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse">
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
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No Events Available</h3>
        <p className="text-gray-500">Check back later for upcoming events</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {events.map((event) => {
        const IconComponent = categoryIcons[event.category] || Calendar;
        const gradientClass = categoryColors[event.category] || 'from-[#ab5244] to-[#8f4437]';
        
        return (
          <div 
            key={event._id} 
            className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 group transform hover:-translate-y-1"
          >
            <div className={`h-48 bg-gradient-to-br ${gradientClass} flex items-center justify-center relative overflow-hidden`}>
              <IconComponent className="text-white transform group-hover:scale-110 transition-transform duration-300" size={64} />
              
              {/* Event status badge */}
              <div className="absolute top-4 right-4">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  event.status === 'upcoming' 
                    ? 'bg-green-100 text-green-800' 
                    : event.status === 'ongoing'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                </span>
              </div>

              {/* Participants count */}
              {event.maxParticipants > 0 && (
                <div className="absolute bottom-4 left-4">
                  <span className="bg-black/30 text-white px-2 py-1 rounded-full text-xs font-semibold">
                    {event.currentParticipants}/{event.maxParticipants}
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
                
                <button className="text-[#ab5244] font-semibold hover:text-[#8f4437] flex items-center gap-1 transition-colors duration-200 group/btn">
                  Learn More
                  <ArrowRight size={16} className="transform group-hover/btn:translate-x-1 transition-transform duration-200" />
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default EventsList;