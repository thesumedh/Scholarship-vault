import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Shield, Menu, X } from 'lucide-react';
import WalletBanner from './WalletBanner';

export default function NavBar() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Overview', path: '/' },
    { name: 'Verify', path: '/verify' },
    { name: 'Admin', path: '/admin' },
    { name: 'About', path: '/about' },
  ];

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo" onClick={() => setMobileMenuOpen(false)}>
          <div className="navbar-logo-icon">
            <Shield size={15} />
          </div>
          <span>Scholarship Vault</span>
        </Link>

        {/* Desktop Links */}
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

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div className="badge-pill" style={{ fontSize: '0.75rem' }}>
            <span className="badge-dot" />
            <span style={{ display: 'inline-block' }}>Preprod</span>
          </div>
          <WalletBanner />
          
          {/* Mobile Menu Toggle */}
          <button
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Navigation Menu"
            style={{
              background: '#18181b',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-xs)',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              display: 'none',
              padding: '0.35rem',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div 
          className="mobile-menu-dropdown"
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.35rem',
            paddingTop: '0.75rem',
            marginTop: '0.5rem',
            borderTop: '1px solid var(--border-subtle)',
          }}
        >
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className={`nav-item ${location.pathname === link.path ? 'active' : ''}`}
              style={{ padding: '0.6rem 0.85rem' }}
            >
              <span>{link.name}</span>
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
