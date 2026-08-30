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
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
        <Loader2 size={13} className="spinner-icon" />
        <span>Detecting</span>
      </div>
    );
  }

  if (isConnected && address) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.45rem',
        background: '#18181b',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-sm)',
        padding: '0.3rem 0.65rem',
      }}>
        <span className="badge-dot" />
        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#fafafa' }}>
          {walletType === '1am' ? '1AM' : 'Lace'}
        </span>
        <button
          onClick={copyAddress}
          title="Copy address"
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-secondary)',
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '0.75rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem',
            padding: 0,
          }}
        >
          <span>{address.slice(0, 6)}…{address.slice(-4)}</span>
          {copied ? <Check size={11} style={{ color: '#10b981' }} /> : <Copy size={11} />}
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
            padding: 0,
            marginLeft: '0.15rem',
          }}
        >
          <LogOut size={12} />
        </button>
      </div>
    );
  }

  return (
    <button
      className="btn btn-secondary"
      style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem' }}
      onClick={() => connect('preprod')}
      disabled={isConnecting}
    >
      {isConnecting ? (
        <>
          <Loader2 size={13} className="spinner-icon" />
          <span>Connecting</span>
        </>
      ) : (
        <>
          <Wallet size={13} />
          <span>Connect Wallet</span>
        </>
      )}
    </button>
  );
}
