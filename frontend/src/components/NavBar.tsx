import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Shield, Sparkles, CheckCircle2, Sliders, Info, BookOpen } from 'lucide-react';
import WalletBanner from './WalletBanner';

export default function NavBar() {
  const location = useLocation();

  const navLinks = [
    { name: 'Overview', path: '/', icon: <Sparkles size={15} /> },
    { name: 'Verify ZK', path: '/verify', icon: <CheckCircle2 size={15} /> },
    { name: 'Admin Portal', path: '/admin', icon: <Sliders size={15} /> },
    { name: 'How It Works', path: '/about', icon: <Info size={15} /> },
  ];

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <div className="navbar-logo-icon">
            <Shield size={18} />
          </div>
          <span>Scholarship <span className="text-gradient">Vault</span></span>
        </Link>

        <div className="navbar-links">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`nav-item ${location.pathname === link.path ? 'active' : ''}`}
            >
              {link.icon}
              <span>{link.name}</span>
            </Link>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div className="badge-pill badge-live" style={{ padding: '0.25rem 0.65rem', fontSize: '0.75rem' }}>
            <span className="badge-dot" />
            <span>Preprod</span>
          </div>
          <WalletBanner />
        </div>
      </div>
    </nav>
  );
}
