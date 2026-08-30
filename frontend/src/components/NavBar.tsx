import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Shield, CheckCircle, Sliders, Info } from 'lucide-react';
import WalletBanner from './WalletBanner';

export default function NavBar() {
  const location = useLocation();

  const navLinks = [
    { name: 'Overview', path: '/' },
    { name: 'Verify', path: '/verify' },
    { name: 'Admin', path: '/admin' },
    { name: 'About', path: '/about' },
  ];

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <div className="navbar-logo-icon">
            <Shield size={16} />
          </div>
          <span>Scholarship Vault</span>
        </Link>

        <div className="navbar-links">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`nav-item ${location.pathname === link.path ? 'active' : ''}`}
            >
              <span>{link.name}</span>
            </Link>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div className="badge-pill" style={{ fontSize: '0.75rem' }}>
            <span className="badge-dot" />
            <span>Preprod</span>
          </div>
          <WalletBanner />
        </div>
      </div>
    </nav>
  );
}
