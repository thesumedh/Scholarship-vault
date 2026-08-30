import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, ExternalLink } from 'lucide-react';
import { PREPROD_CONTRACT_ADDRESS } from '../config';

export default function Footer() {
  return (
    <footer style={{ 
      borderTop: '1px solid var(--border-subtle)', 
      marginTop: '5rem', 
      padding: '3.5rem 1rem 2rem', 
      background: 'rgba(6, 6, 10, 0.95)',
      position: 'relative'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '2.5rem' }}>

        {/* Brand */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', textDecoration: 'none', color: '#fff' }}>
            <div className="navbar-logo-icon" style={{ width: 28, height: 28 }}>
              <Shield size={16} />
            </div>
            <span style={{ fontSize: '1.15rem', fontWeight: 800, fontFamily: 'Outfit, sans-serif' }}>
              Scholarship <span className="text-gradient">Vault</span>
            </span>
          </Link>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            Next-generation privacy-preserving academic credential &amp; scholarship verification on the Midnight Network.
          </p>
          <div className="badge-pill badge-live" style={{ width: 'fit-content', fontSize: '0.75rem', padding: '0.25rem 0.65rem' }}>
            <span className="badge-dot" />
            <span>Midnight Preprod Connected</span>
          </div>
        </div>

        {/* DApp Navigation */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          <h4 style={{ color: '#fff', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Navigation</h4>
          {[
            ['/', 'Overview'],
            ['/verify', 'Verify Eligibility'],
            ['/about', 'Cryptographic Model'],
            ['/admin', 'Admin & Deployment'],
          ].map(([path, label]) => (
            <Link 
              key={path} 
              to={path} 
              style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.875rem', transition: 'color 0.2s' }}
              onMouseOver={e => (e.currentTarget.style.color = '#fff')}
              onMouseOut={e => (e.currentTarget.style.color = 'var(--text-secondary)')}
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Midnight Network Resources */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          <h4 style={{ color: '#fff', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Resources</h4>
          {[
            [`https://explorer.1am.xyz/contract/${PREPROD_CONTRACT_ADDRESS}`, '1AM Preprod Explorer'],
            [`https://preprod.midnightexplorer.com/contracts/${PREPROD_CONTRACT_ADDRESS}`, 'Midnight Explorer'],
            ['https://docs.midnight.network/', 'Midnight Docs'],
            ['https://github.com/thesumedh/Scholarship-vault', 'GitHub Repo'],
          ].map(([href, label]) => (
            <a 
              key={href} 
              href={href} 
              target="_blank" 
              rel="noopener noreferrer" 
              style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.3rem', transition: 'color 0.2s' }}
              onMouseOver={e => (e.currentTarget.style.color = '#fff')}
              onMouseOut={e => (e.currentTarget.style.color = 'var(--text-secondary)')}
            >
              <span>{label}</span>
              <ExternalLink size={11} />
            </a>
          ))}
        </div>

        {/* Builder & Social */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          <h4 style={{ color: '#fff', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Builder</h4>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            Developed by <a href="https://github.com/thesumedh" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-light)', fontWeight: 600 }}>@thesumedh</a>
          </p>
          <a 
            href="https://x.com/thesumedh_" 
            target="_blank" 
            rel="noopener noreferrer" 
            style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
            onMouseOver={e => (e.currentTarget.style.color = '#fff')}
            onMouseOut={e => (e.currentTarget.style.color = 'var(--text-secondary)')}
          >
            <span>𝕏 @thesumedh_</span>
            <ExternalLink size={11} />
          </a>
        </div>

      </div>

      <div style={{ borderTop: '1px solid var(--border-subtle)', marginTop: '3rem', paddingTop: '1.5rem', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
          Scholarship Vault · Apache 2.0 Open Source License · Built for Midnight Buildthon
        </p>
      </div>
    </footer>
  );
}
