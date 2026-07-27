import React from 'react';
import { useWallet } from '../contexts/WalletContext';

export default function WalletBanner() {
  const { address, isConnected, walletType, walletStatus, isConnecting, connect, disconnect } = useWallet();

  if (walletStatus === 'checking') {
    return (
      <div className="wallet-pill loading">
        <span className="spinner-small"></span>
        <span>Detecting wallet...</span>
      </div>
    );
  }

  if (isConnected && address) {
    return (
      <div className="wallet-pill connected">
        <div className="status-dot connected"></div>
        <div className="wallet-pill-info">
          <div className="wallet-pill-type">{walletType === '1am' ? '1AM' : 'Lace'}</div>
          <div className="wallet-pill-address">{address.slice(0, 8)}…{address.slice(-6)}</div>
        </div>
        <button className="btn-icon" onClick={disconnect} title="Disconnect Wallet">
          ✕
        </button>
      </div>
    );
  }

  return (
    <button
      className="btn btn-primary btn-sm"
      onClick={() => connect('preprod')}
      disabled={isConnecting || walletStatus === 'not-found'}
    >
      {isConnecting ? (
        <>
          <span className="spinner-small"></span>
          Connecting
        </>
      ) : (
        'Connect Wallet'
      )}
    </button>
  );
}
