import { useState } from "react";
import { Link, useLocation } from "wouter";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [location] = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const isActive = (path: string) => {
    return location === path;
  };

  return (
    <nav className="bg-secondary sticky top-0 z-50 shadow-lg">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="flex items-center">
          <span className="text-primary font-heading text-2xl sm:text-3xl tracking-tighter">
            RAD<span className="text-accent">RAMPS</span>
          </span>
        </Link>
        
        <div className="hidden md:flex space-x-8 items-center">
          <Link 
            href="/" 
            className={`nav-item text-white font-bold hover:text-primary transition-colors ${isActive('/') ? 'text-primary' : ''}`}
          >
            HOME
          </Link>
          <Link 
            href="/free-parks" 
            className={`nav-item text-white font-bold hover:text-primary transition-colors ${isActive('/free-parks') ? 'text-primary' : ''}`}
          >
            FREE PARKS
          </Link>
          <Link 
            href="/paid-parks" 
            className={`nav-item text-white font-bold hover:text-primary transition-colors ${isActive('/paid-parks') ? 'text-primary' : ''}`}
          >
            PAID PARKS
          </Link>
          <Link 
            href="/about" 
            className={`nav-item text-white font-bold hover:text-primary transition-colors ${isActive('/about') ? 'text-primary' : ''}`}
          >
            ABOUT US
          </Link>
        </div>
        
        <button 
          className="block md:hidden text-white text-2xl focus:outline-none"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <i className={`fas ${isMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
        </button>
      </div>
      
      {/* Mobile menu */}
      <div className={`${isMenuOpen ? 'block' : 'hidden'} bg-dark md:hidden py-3`}>
        <Link 
          href="/" 
          className={`block text-white font-bold hover:bg-secondary hover:text-primary px-4 py-2 transition-colors ${isActive('/') ? 'text-primary' : ''}`}
          onClick={closeMenu}
        >
          HOME
        </Link>
        <Link 
          href="/free-parks" 
          className={`block text-white font-bold hover:bg-secondary hover:text-primary px-4 py-2 transition-colors ${isActive('/free-parks') ? 'text-primary' : ''}`}
          onClick={closeMenu}
        >
          FREE PARKS
        </Link>
        <Link 
          href="/paid-parks" 
          className={`block text-white font-bold hover:bg-secondary hover:text-primary px-4 py-2 transition-colors ${isActive('/paid-parks') ? 'text-primary' : ''}`}
          onClick={closeMenu}
        >
          PAID PARKS
        </Link>
        <Link 
          href="/about" 
          className={`block text-white font-bold hover:bg-secondary hover:text-primary px-4 py-2 transition-colors ${isActive('/about') ? 'text-primary' : ''}`}
          onClick={closeMenu}
        >
          ABOUT US
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
