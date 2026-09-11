import React, { useState } from 'react';
import { useWallet } from '../contexts/WalletContext';
import { Wallet, Loader2, LogOut, Check, Copy, AlertCircle, ChevronDown, ExternalLink, RefreshCw } from 'lucide-react';

export default function WalletBanner() {
  const {
    address,
    isConnected,
    walletType,
    walletStatus,
    walletError,
    availableWallets,
    isConnecting,
    connect,
    disconnect,
    clearError,
  } = useWallet();

  const [copied, setCopied] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const copyAddress = () => {
    if (!address) return;
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleConnectClick = async (target?: '1am' | 'lace') => {
    setMenuOpen(false);
    try {
      await connect('preprod', target);
    } catch {
      // Error is caught and stored in walletError in WalletContext
    }
  };

  // Connected State
  if (isConnected && address) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.45rem',
          background: '#18181b',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-sm)',
          padding: '0.3rem 0.65rem',
        }}
      >
        <span className="badge-dot" />
        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#fafafa' }}>
          {walletType === '1am' ? '1AM' : walletType === 'lace' ? 'Lace' : 'Midnight'}
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
          <span>
            {address.slice(0, 6)}…{address.slice(-4)}
          </span>
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

  const has1am = availableWallets.some((w) => w.type === '1am');
  const hasLace = availableWallets.some((w) => w.type === 'lace');
  const hasMultiple = (has1am && hasLace) || availableWallets.length > 1;

  return (
    <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
      {/* Primary Connect Button */}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <button
          className="btn btn-secondary"
          style={{
            padding: '0.4rem 0.85rem',
            fontSize: '0.8rem',
            borderTopRightRadius: hasMultiple ? 0 : 'var(--radius-sm)',
            borderBottomRightRadius: hasMultiple ? 0 : 'var(--radius-sm)',
          }}
          onClick={() => handleConnectClick(has1am ? '1am' : hasLace ? 'lace' : undefined)}
          disabled={isConnecting}
          title="Connect to Midnight Preprod with 1AM or Lace"
        >
          {isConnecting ? (
            <>
              <Loader2 size={13} className="spinner-icon" />
              <span>Connecting…</span>
            </>
          ) : (
            <>
              <Wallet size={13} />
              <span>{has1am ? 'Connect 1AM' : hasLace ? 'Connect Lace' : 'Connect Wallet'}</span>
            </>
          )}
        </button>

        {hasMultiple && (
          <button
            className="btn btn-secondary"
            style={{
              padding: '0.4rem 0.45rem',
              fontSize: '0.8rem',
              borderLeft: 'none',
              borderTopLeftRadius: 0,
              borderBottomLeftRadius: 0,
            }}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Select wallet"
            title="Choose wallet"
          >
            <ChevronDown size={13} />
          </button>
        )}
      </div>

      {/* Multi-Wallet Dropdown Menu */}
      {menuOpen && hasMultiple && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 6px)',
            right: 0,
            background: '#18181b',
            border: '1px solid var(--border-medium)',
            borderRadius: 'var(--radius-sm)',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.5)',
            zIndex: 150,
            minWidth: '160px',
            padding: '0.35rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.2rem',
          }}
        >
          {has1am && (
            <button
              onClick={() => handleConnectClick('1am')}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#fafafa',
                fontSize: '0.8rem',
                textAlign: 'left',
                padding: '0.4rem 0.6rem',
                borderRadius: 'var(--radius-xs)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = '#27272a')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            >
              <span>1AM Wallet</span>
              <span style={{ fontSize: '0.7rem', color: '#10b981' }}>Detected</span>
            </button>
          )}
          {hasLace && (
            <button
              onClick={() => handleConnectClick('lace')}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#fafafa',
                fontSize: '0.8rem',
                textAlign: 'left',
                padding: '0.4rem 0.6rem',
                borderRadius: 'var(--radius-xs)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = '#27272a')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            >
              <span>Lace Wallet</span>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Detected</span>
            </button>
          )}
        </div>
      )}

      {/* Error / Diagnostic Popover */}
      {walletError && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            right: 0,
            background: '#121215',
            border: '1px solid #7f1d1d',
            borderRadius: 'var(--radius-sm)',
            boxShadow: '0 12px 30px rgba(0, 0, 0, 0.65)',
            zIndex: 160,
            width: '290px',
            padding: '0.75rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '0.45rem' }}>
            <AlertCircle size={15} style={{ color: '#ef4444', flexShrink: 0, marginTop: '2px' }} />
            <div style={{ fontSize: '0.75rem', color: '#fca5a5', lineHeight: 1.4 }}>
              <strong>Connection Error</strong>
              <div style={{ marginTop: '0.2rem', color: '#e4e4e7', fontSize: '0.72rem', wordBreak: 'break-word' }}>
                {walletError}
              </div>
            </div>
          </div>

          <div
            style={{
              fontSize: '0.7rem',
              color: 'var(--text-muted)',
              lineHeight: 1.4,
              borderTop: '1px solid #27272a',
              paddingTop: '0.45rem',
              marginTop: '0.45rem',
            }}
          >
            💡 <strong>1AM Checklist:</strong>
            <ul style={{ paddingLeft: '1rem', margin: '0.25rem 0 0.45rem 0' }}>
              <li>Unlock your 1AM extension</li>
              <li>Ensure network is set to <strong>Preprod</strong></li>
              <li>Allow popups if requested</li>
            </ul>
          </div>

          <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'flex-end', marginTop: '0.35rem' }}>
            <button
              className="btn btn-secondary"
              style={{ padding: '0.25rem 0.55rem', fontSize: '0.7rem' }}
              onClick={clearError}
            >
              Dismiss
            </button>
            <button
              className="btn btn-primary"
              style={{ padding: '0.25rem 0.55rem', fontSize: '0.7rem' }}
              onClick={() => handleConnectClick('1am')}
            >
              <RefreshCw size={11} />
              <span>Retry 1AM</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
