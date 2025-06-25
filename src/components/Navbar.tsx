import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Bot, Settings, Wallet, HelpCircle, BookOpen, Star, Info, Menu, X } from 'lucide-react';

const Navbar: React.FC = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { path: '#about', icon: Info, label: 'About' },
    { path: '#features', icon: Star, label: 'Features' },
    { path: '#how-to', icon: BookOpen, label: 'How To' },
    { path: '#faq', icon: HelpCircle, label: 'FAQ' },
  ];

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    const element = document.querySelector(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false); // Close mobile menu after navigation
  };

  return (
    <nav className="bg-white text-black border-b border-amber-900/20 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
              <div className="w-10 h-10 bg-brand-600 rounded-xl flex items-center justify-center">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="font-['Montserrat'] text-[20px] font-[700] text-black">
                  Chain Agent
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              return (
                <a
                  key={item.path}
                  href={item.path}
                  onClick={(e) => handleScroll(e, item.path)}
                  className="px-4 py-2 rounded-[12px] font-['Montserrat'] text-[14px] font-[500] transition-all duration-200 flex items-center space-x-2 text-black/80 hover:bg-amber-900/20 hover:text-black"
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </a>
              );
            })}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center space-x-4">
            <Link 
              to="/dashboard" 
              className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-[12px] font-['Montserrat'] text-[14px] font-[600] transition-colors flex items-center space-x-2"
            >
              <span>Connect Wallet</span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <Link 
              to="/dashboard" 
              className="px-3 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-[12px] font-['Montserrat'] text-[12px] font-[600] transition-colors"
            >
              <span>Connect</span>
            </Link>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-[12px] text-black/80 hover:bg-amber-900/20 transition-colors"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-amber-900/20">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map((item) => (
                <a
                  key={item.path}
                  href={item.path}
                  onClick={(e) => handleScroll(e, item.path)}
                  className="flex items-center space-x-3 px-3 py-2 rounded-[12px] font-['Montserrat'] text-[14px] font-[500] text-black/80 hover:bg-amber-900/20 hover:text-black transition-all duration-200"
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </a>
              ))}
              <div className="pt-2">
                <Link 
                  to="/dashboard" 
                  className="flex items-center justify-center w-full px-3 py-3 bg-brand-600 hover:bg-brand-700 text-white rounded-[12px] font-['Montserrat'] text-[14px] font-[600] transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span>Connect Wallet</span>
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