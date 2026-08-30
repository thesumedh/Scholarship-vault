import React, { useState } from 'react';
import { useWallet } from '../contexts/WalletContext';
import { Wallet, Loader2, LogOut, Check, Copy } from 'lucide-react';

export default function WalletBanner() {
  const { address, isConnected, walletType, walletStatus, isConnecting, connect, disconnect } = useWallet();
  const [copied, setCopied] = useState(false);

  const copyAddress = () => {
    if (!address) return;
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (walletStatus === 'checking') {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.825rem' }}>
        <Loader2 size={14} className="spinner-icon" />
        <span>Detecting...</span>
      </div>
    );
  }

  if (isConnected && address) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        background: 'rgba(255, 255, 255, 0.05)',
        border: '1px solid var(--border-medium)',
        borderRadius: 'var(--radius-pill)',
        padding: '0.3rem 0.75rem',
      }}>
        <span className="badge-dot" />
        <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--accent-light)' }}>
          {walletType === '1am' ? '1AM' : 'Lace'}
        </span>
        <button
          onClick={copyAddress}
          title="Click to copy address"
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-secondary)',
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '0.8rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem',
          }}
        >
          <span>{address.slice(0, 8)}…{address.slice(-6)}</span>
          {copied ? <Check size={12} style={{ color: '#10b981' }} /> : <Copy size={12} />}
        </button>
        <button
          onClick={disconnect}
          title="Disconnect"
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            padding: '2px',
          }}
        >
          <LogOut size={13} />
        </button>
      </div>
    );
  }

  return (
    <button
      className="btn btn-primary"
      style={{ padding: '0.45rem 1rem', fontSize: '0.85rem', borderRadius: 'var(--radius-pill)' }}
      onClick={() => connect('preprod')}
      disabled={isConnecting}
    >
      {isConnecting ? (
        <>
          <Loader2 size={14} className="spinner-icon" />
          <span>Connecting...</span>
        </>
      ) : (
        <>
          <Wallet size={14} />
          <span>Connect Wallet</span>
        </>
      )}
    </button>
  );
}
