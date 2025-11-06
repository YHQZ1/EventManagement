import React, { useState } from 'react';
import { Calendar, Users, Bell, Heart, Sparkles, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import  EventsList  from '../components/EventsList' 

const LandingPage = () => {
  const [isAuthenticated] = useState(false);

  const handleNavClick = (sectionId) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Sparkles className="text-[#ab5244]" size={28} />
              <h1 className="text-2xl font-bold text-gray-900">ISKCON Events</h1>
            </div>
            <nav className="hidden md:flex items-center gap-8 text-gray-700">
              <button onClick={() => handleNavClick('about')} className="hover:text-[#ab5244] transition">About</button>
              <button onClick={() => handleNavClick('features')} className="hover:text-[#ab5244] transition">Features</button>
              <button onClick={() => handleNavClick('events')} className="hover:text-[#ab5244] transition">Events</button>
            </nav>
            <button className="bg-[#ab5244] text-white px-6 py-2.5 rounded-full hover:bg-[#8f4437] transition shadow-md">
              {isAuthenticated ? (
                <Link 
                  to="/auth" 
                  className="text-white px-4 py-2 rounded"
                >
                  Dashboard
                </Link>
              ) : (
                <Link 
                  to="/auth" 
                  className="text-white px-4 py-2 rounded"
                >
                  Get Started
                </Link>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-orange-50 to-stone-100 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 py-24 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Empowering <span className="text-[#ab5244]">Spiritual Growth</span>, Together
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Join us in creating meaningful connections through devotional events. 
                Our platform makes it simple to organize, manage, and participate in 
                spiritual gatherings that bring communities closer.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="bg-[#ab5244] text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-[#8f4437] transition shadow-lg inline-flex items-center justify-center gap-2">
                  {isAuthenticated ? 'Go to Dashboard' : 'Start Managing Events'}
                  <Calendar size={20} />
                </button>
                <button 
                  onClick={() => handleNavClick('features')}
                  className="border-2 border-[#ab5244] text-[#ab5244] px-8 py-4 rounded-full text-lg font-semibold hover:bg-[#ab5244] hover:text-white transition inline-flex items-center justify-center"
                >
                  Learn More
                </button>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-[#ab5244] to-[#8f4437] rounded-3xl p-12 shadow-2xl transform rotate-3 hover:rotate-0 transition duration-500">
                <div className="bg-white rounded-2xl p-8 transform -rotate-3">
                  <Calendar className="text-[#ab5244] mb-4" size={48} />
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Simple Event Management</h3>
                  <p className="text-gray-600">Organize devotional gatherings with ease</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Decorative circles */}
        <div className="absolute top-20 right-10 w-32 h-32 bg-[#ab5244] opacity-10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-10 w-40 h-40 bg-orange-300 opacity-20 rounded-full blur-3xl"></div>
      </section>

      {/* Stats Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-[#ab5244] bg-opacity-10 rounded-full mb-4">
                <Heart className="text-[#ab5244]" size={32} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Easy Registration</h3>
              <p className="text-gray-600">Quick and seamless event sign-ups for devotees</p>
            </div>
            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-[#ab5244] bg-opacity-10 rounded-full mb-4">
                <Users className="text-[#ab5244]" size={32} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Community Building</h3>
              <p className="text-gray-600">Connect devotees and strengthen spiritual bonds</p>
            </div>
            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-[#ab5244] bg-opacity-10 rounded-full mb-4">
                <Bell className="text-[#ab5244]" size={32} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Smart Notifications</h3>
              <p className="text-gray-600">Never miss an important spiritual gathering</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 bg-gradient-to-br from-stone-50 to-orange-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="bg-[#ab5244] rounded-3xl p-12 shadow-2xl">
                <div className="bg-white rounded-2xl p-8 space-y-4">
                  <div className="flex items-center gap-3 p-4 bg-stone-50 rounded-lg">
                    <Calendar className="text-[#ab5244]" size={24} />
                    <span className="font-semibold text-gray-900">Event Scheduling</span>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-stone-50 rounded-lg">
                    <Users className="text-[#ab5244]" size={24} />
                    <span className="font-semibold text-gray-900">Attendee Management</span>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-stone-50 rounded-lg">
                    <Bell className="text-[#ab5244]" size={24} />
                    <span className="font-semibold text-gray-900">Automated Reminders</span>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Helping Each Other Can Make Devotion Better
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Our platform is designed to bring the ISKCON community together, making it 
                easier than ever to organize and participate in spiritual events. Whether 
                you're planning a kirtan, festival, or weekly gathering, we provide the 
                tools you need.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#ab5244] flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <span className="text-gray-700">Streamlined event creation and management</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#ab5244] flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <span className="text-gray-700">Role-based access for admins and devotees</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#ab5244] flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <span className="text-gray-700">Customizable notification preferences</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              We Are Here to Help Them
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Comprehensive tools designed to make spiritual event management effortless
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-stone-50 p-8 rounded-2xl hover:shadow-xl transition group">
              <div className="w-14 h-14 bg-[#ab5244] bg-opacity-10 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition">
                <Calendar className="text-[#ab5244]" size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Event Creation</h3>
              <p className="text-gray-600">
                Create and manage devotional events with our intuitive interface
              </p>
            </div>

            <div className="bg-[#ab5244] p-8 rounded-2xl hover:shadow-xl transition group text-white">
              <div className="w-14 h-14 bg-white bg-opacity-20 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition">
                <Users className="text-white" size={28} />
              </div>
              <h3 className="text-xl font-bold mb-3">User Roles</h3>
              <p className="text-orange-50">
                Admin and devotee roles with appropriate permissions and access
              </p>
            </div>

            <div className="bg-stone-50 p-8 rounded-2xl hover:shadow-xl transition group">
              <div className="w-14 h-14 bg-[#ab5244] bg-opacity-10 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition">
                <Bell className="text-[#ab5244]" size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Notifications</h3>
              <p className="text-gray-600">
                Instant, daily, or weekly updates to keep everyone informed
              </p>
            </div>

            <div className="bg-stone-50 p-8 rounded-2xl hover:shadow-xl transition group">
              <div className="w-14 h-14 bg-[#ab5244] bg-opacity-10 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition">
                <Clock className="text-[#ab5244]" size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Real-time Updates</h3>
              <p className="text-gray-600">
                Stay synchronized with live event changes and announcements
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Join Section */}
      <section className="py-24 bg-gradient-to-br from-orange-50 to-stone-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Join Us in Creating a Better Spiritual Community
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Be part of a movement that brings devotees together through meaningful events and shared experiences
            </p>
          </div>
        </div>
      </section>

      {/* Events Section */}
      <section id="events" className="py-24 bg-white">
  <div className="max-w-7xl mx-auto px-6">
    <div className="text-center mb-16">
      <h2 className="text-4xl font-bold text-gray-900 mb-4">
        Find Popular Events and Make a Difference
      </h2>
      <p className="text-xl text-gray-600 max-w-3xl mx-auto">
        Join our community in meaningful devotional events, spiritual gatherings, and service opportunities
      </p>
    </div>
    
    <EventsList />
  </div>
</section>

      {/* CTA Section */}
      <section className="relative py-24 bg-gradient-to-br from-[#ab5244] to-[#8f4437] overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Join Us in Building a Better Life and a Brighter Future
          </h2>
          <p className="text-xl text-orange-50 mb-10 leading-relaxed">
            Become part of the ISKCON community and help organize spiritual events 
            that inspire and unite devotees around the world.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-[#ab5244] px-10 py-4 rounded-full text-lg font-semibold hover:bg-gray-100 transition shadow-xl inline-flex items-center justify-center gap-2">
              {isAuthenticated ? 'Go to Dashboard' : 'Become a Volunteer'}
              <Sparkles size={20} />
            </button>
            <button
              onClick={() => handleNavClick('features')}
              className="border-2 border-white text-white px-10 py-4 rounded-full text-lg font-semibold hover:bg-white hover:text-[#ab5244] transition inline-flex items-center justify-center"
            >
              Learn More
            </button>
          </div>
        </div>
        <div className="absolute top-10 right-10 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 left-10 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl"></div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="text-[#ab5244]" size={24} />
                <h3 className="text-xl font-bold text-white">ISKCON Events</h3>
              </div>
              <p className="text-gray-400">
                Empowering spiritual growth through organized devotional events.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><button onClick={() => handleNavClick('features')} className="hover:text-[#ab5244] transition">Features</button></li>
                <li><button onClick={() => handleNavClick('about')} className="hover:text-[#ab5244] transition">About Us</button></li>
                <li><button onClick={() => handleNavClick('causes')} className="hover:text-[#ab5244] transition">Events</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Resources</h4>
              <ul className="space-y-2">
                <li><button className="hover:text-[#ab5244] transition">Help Center</button></li>
                <li><button className="hover:text-[#ab5244] transition">Guidelines</button></li>
                <li><button className="hover:text-[#ab5244] transition">Contact</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Connect</h4>
              <p className="text-gray-400 mb-4">
                Join our community and stay updated with the latest events.
              </p>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center">
            <p className="text-gray-400">&copy; 2025 ISKCON Event Management. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;