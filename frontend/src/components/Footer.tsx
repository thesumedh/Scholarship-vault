import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Github, Twitter, Globe } from 'lucide-react';

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
              <Github size={18} />
            </a>
            <a href="https://x.com/thesumedh_" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-secondary)', transition: 'color 0.2s' }} onMouseOver={e => (e.currentTarget.style.color = 'var(--accent-color)')} onMouseOut={e => (e.currentTarget.style.color = 'var(--text-secondary)')}>
              <Twitter size={18} />
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
