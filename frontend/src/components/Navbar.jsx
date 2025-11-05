import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Bell, User } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Events', path: '/events' },
    { name: 'Services', path: '/services' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' }
  ];

  return (
    <nav className="bg-iskcon-orange shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-iskcon-blue rounded-full flex items-center justify-center">
                  <span className="text-iskcon-white text-xl font-bold">ॐ</span>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-iskcon-white font-sanskrit">
                    ISKCON
                  </h1>
                  <p className="text-iskcon-white text-sm">Hare Krishna Movement</p>
                </div>
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    location.pathname === item.path
                      ? 'text-iskcon-white bg-iskcon-blue'
                      : 'text-iskcon-white hover:bg-iskcon-blue hover:bg-opacity-50'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <button className="text-iskcon-white hover:text-iskcon-gold transition-colors">
              <Bell size={20} />
            </button>
            <Link
              to="/auth"
              className="bg-iskcon-blue text-iskcon-white px-6 py-2 rounded-full hover:bg-iskcon-maroon transition-colors flex items-center space-x-2"
            >
              <User size={16} />
              <span>Login</span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-iskcon-white hover:text-iskcon-gold focus:outline-none"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-iskcon-orange bg-opacity-95 rounded-lg mt-2">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                    location.pathname === item.path
                      ? 'text-iskcon-white bg-iskcon-blue'
                      : 'text-iskcon-white hover:bg-iskcon-blue hover:bg-opacity-50'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="pt-4 border-t border-iskcon-white border-opacity-20">
                <Link
                  to="/auth"
                  className="block px-3 py-2 text-iskcon-white hover:bg-iskcon-blue rounded-md"
                  onClick={() => setIsOpen(false)}
                >
                  Login / Register
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;