import React from 'react';
import { Link } from 'react-router-dom';
import { Shield } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{ borderTop: '1px solid var(--border-color)', marginTop: '4rem', padding: '3rem 0', backgroundColor: 'var(--bg-main)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', padding: '0 2rem' }}>

        {/* Brand */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', color: '#fff' }}>
            <Shield size={22} style={{ color: 'var(--accent-color)' }} />
            <span style={{ fontSize: '1.1rem', fontWeight: 700 }}>Scholar<span style={{ color: 'var(--accent-color)' }}>Shield</span></span>
          </Link>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            Privacy-preserving scholarship eligibility using Zero-Knowledge proofs on Midnight Network.
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.25rem' }}>
            <a href="https://github.com/thesumedh" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-secondary)', transition: 'color 0.2s' }} onMouseOver={e => (e.currentTarget.style.color = 'var(--accent-color)')} onMouseOut={e => (e.currentTarget.style.color = 'var(--text-secondary)')}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
            </a>
            <a href="https://x.com/thesumedh_" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-secondary)', transition: 'color 0.2s' }} onMouseOver={e => (e.currentTarget.style.color = 'var(--accent-color)')} onMouseOut={e => (e.currentTarget.style.color = 'var(--text-secondary)')}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </a>
          </div>
        </div>

        {/* App Links */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          <h4 style={{ color: '#fff', fontWeight: 600, marginBottom: '0.25rem', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>App</h4>
          {[['/', 'Home'], ['/verify', 'Verify Eligibility'], ['/about', 'How it Works'], ['/admin', 'Admin Portal']].map(([path, label]) => (
            <Link key={path} to={path} style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.875rem', transition: 'color 0.2s' }} onMouseOver={e => (e.currentTarget.style.color = '#fff')} onMouseOut={e => (e.currentTarget.style.color = 'var(--text-secondary)')}>
              {label}
            </Link>
          ))}
        </div>

        {/* Resources */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          <h4 style={{ color: '#fff', fontWeight: 600, marginBottom: '0.25rem', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Resources</h4>
          {[
            ['https://midnight.network/', 'Midnight Network'],
            ['https://docs.midnight.network/', 'Documentation'],
            ['https://github.com/midnight-ntwrk', 'GitHub'],
          ].map(([href, label]) => (
            <a key={href} href={href} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.875rem', transition: 'color 0.2s' }} onMouseOver={e => (e.currentTarget.style.color = '#fff')} onMouseOut={e => (e.currentTarget.style.color = 'var(--text-secondary)')}>
              {label}
            </a>
          ))}
        </div>

        {/* Network Status */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          <h4 style={{ color: '#fff', fontWeight: 600, marginBottom: '0.25rem', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Network</h4>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#4ade80', boxShadow: '0 0 8px #4ade80', display: 'inline-block' }} />
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Preprod Live</span>
          </div>
          <span style={{ display: 'inline-block', padding: '0.2rem 0.6rem', backgroundColor: 'var(--accent-glow)', color: 'var(--accent-color)', borderRadius: 6, fontSize: '0.75rem', border: '1px solid rgba(167,139,250,0.2)', width: 'fit-content' }}>
            v1.0.0
          </span>
        </div>

      </div>

      <div style={{ borderTop: '1px solid var(--border-color)', marginTop: '2.5rem', paddingTop: '1.5rem', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
          Built for the <span style={{ color: 'var(--text-secondary)' }}>Midnight Buildthon</span> by{' '}
          <a href="https://github.com/thesumedh" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-color)', textDecoration: 'none', fontWeight: 600 }}>
            @thesumedh
          </a>
          {' '}·{' '}
          <a href="https://x.com/thesumedh_" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>
            𝕏 thesumedh_
          </a>
        </p>
      </div>
    </footer>
  );
}
