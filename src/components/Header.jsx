import { useState } from 'react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      {/* Emergency Banner */}
      <div className="bg-emergency-600 text-white py-2">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm font-medium">
            🚨 EMERGENCY HOTLINE: <a href="tel:+1-800-RAPID-WASTE" className="font-bold underline hover:text-emergency-200">(800) RAPID-WASTE</a> - Available 24/7
          </p>
        </div>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="bg-primary-600 p-3 rounded-lg">
              <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">RapidWaste</h1>
              <p className="text-sm text-gray-600">Emergency Pickup Service</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#home" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">Home</a>
            <a href="#services" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">Services</a>
            <a href="#booking" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">Book Now</a>
            <a href="#contact" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">Contact</a>
            <button className="btn-emergency">
              Emergency Pickup
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-200">
            <nav className="flex flex-col space-y-4 pt-4">
              <a href="#home" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">Home</a>
              <a href="#services" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">Services</a>
              <a href="#booking" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">Book Now</a>
              <a href="#contact" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">Contact</a>
              <button className="btn-emergency w-full">
                Emergency Pickup
              </button>
            </nav>
          </div>
        )}
      </div>


    </header>
  );
};

export default Header; 