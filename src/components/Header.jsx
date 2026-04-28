import { useState } from 'react';
import { useTenant } from '../contexts/TenantContext';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { tenant } = useTenant();

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      {/* Premium Banner */}
      <div className="bg-primary-900 text-white py-2">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm font-medium">
            ✨ PRIORITY CONCIERGE: <a href={`tel:${tenant?.phone}`} className="font-bold underline hover:text-primary-200">{tenant?.phone || '(800) RAPID-MOVE'}</a> - {tenant?.name || 'Relocation & Clearing Specialists'}
          </p>
        </div>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="bg-primary-600 p-3 rounded-lg">
              {tenant?.logo ? (
                <img src={tenant.logo} alt={tenant.name} className="h-8 w-8 object-contain" />
              ) : (
                <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{tenant?.name || 'Rapid Move & Clear'}</h1>
              <p className="text-sm text-gray-600">Premium Relocation & Clearing</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#home" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">Home</a>
            <a href="#services" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">Services</a>
            <a href="#booking" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">Book Now</a>
            <a href="#contact" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">Contact</a>
            <button className="bg-primary-600 hover:opacity-90 text-primary-fg px-6 py-2 rounded-lg font-semibold transition-colors">
              Priority Booking
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
              <button className="bg-primary-600 hover:bg-primary-700 text-white w-full py-3 rounded-lg font-semibold transition-colors">
                Priority Booking
              </button>
            </nav>
          </div>
        )}
      </div>


    </header>
  );
};

export default Header; 