import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, ExternalLink } from 'lucide-react';
import { PREPROD_CONTRACT_ADDRESS } from '../config';

export default function Footer() {
  return (
    <footer style={{ 
      borderTop: '1px solid var(--border-subtle)', 
      marginTop: '4rem', 
      padding: '2.5rem 1.25rem', 
      background: 'var(--bg-deep)',
      fontSize: '0.85rem'
    }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div className="navbar-logo-icon" style={{ width: 24, height: 24 }}>
            <Shield size={13} />
          </div>
          <span style={{ fontWeight: 600, color: '#fff' }}>Scholarship Vault</span>
          <span style={{ color: 'var(--text-muted)' }}>· Midnight Preprod</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
          <Link to="/" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Overview</Link>
          <Link to="/verify" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Verify</Link>
          <Link to="/about" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>How it Works</Link>
          <Link to="/admin" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Admin</Link>
          <a href={`https://explorer.1am.xyz/contract/${PREPROD_CONTRACT_ADDRESS}`} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-secondary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
            <span>Explorer</span>
            <ExternalLink size={10} />
          </a>
          <a href="https://x.com/ScholrshipVault" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>
            𝕏 @ScholrshipVault
          </a>
        </div>

      </div>
    </footer>
  );
}
