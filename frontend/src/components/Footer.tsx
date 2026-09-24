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
          <img 
            src="/logo.jpg" 
            alt="Scholarship Vault" 
            style={{ 
              width: '22px', 
              height: '22px', 
              borderRadius: '5px', 
              objectFit: 'cover',
              border: '1px solid rgba(168, 85, 247, 0.3)' 
            }} 
          />
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
          <a href="https://forms.gle/debb5b8EaQZyfMTw5" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Feedback Form</a>
          <a href="https://docs.google.com/spreadsheets/d/1NY72SNhk_Aq_ZR7SINn1E5zE9GKvXGUhe_njx08nuWc/edit?usp=sharing" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Live Responses</a>
          <a href="https://x.com/ScholrshipVault" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>
            𝕏 @ScholrshipVault
          </a>
        </div>

      </div>
    </footer>
  );
}
