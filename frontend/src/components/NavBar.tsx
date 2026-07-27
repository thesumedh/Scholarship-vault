import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Shield, Home, Key, Lock, Info } from 'lucide-react';
import WalletBanner from './WalletBanner';

export default function NavBar() {
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/', icon: <Home size={16} /> },
    { name: 'Verify', path: '/verify', icon: <Key size={16} /> },
    { name: 'Admin', path: '/admin', icon: <Lock size={16} /> },
    { name: 'About', path: '/about', icon: <Info size={16} /> },
  ];

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <Shield className="text-accent" size={24} />
          <span>Scholar<span className="text-accent">Shield</span></span>
        </Link>

        <div className="navbar-links">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`nav-item ${location.pathname === link.path ? 'active' : ''}`}
            >
              {link.icon}
              <span className="nav-item-text">{link.name}</span>
            </Link>
          ))}
        </div>

        <div className="navbar-wallet">
          <WalletBanner />
        </div>
      </div>
    </nav>
  );
}
