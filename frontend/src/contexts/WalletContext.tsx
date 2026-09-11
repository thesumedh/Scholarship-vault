import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { createConnectedSession, type ConnectedSession } from '../lib/midnight';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
export type WalletType = '1am' | 'lace' | 'other' | null;
export type WalletStatus = 'checking' | 'detected' | 'not-found';

export interface DiscoveredWallet {
  id: string;
  name: string;
  type: '1am' | 'lace' | 'other';
  raw: any;
}

type WalletContextType = {
  address: string | null;
  isConnected: boolean;
  walletType: WalletType;
  isConnecting: boolean;
  walletStatus: WalletStatus;
  walletError: string | null;
  availableWallets: DiscoveredWallet[];
  session: ConnectedSession | null;
  connect: (network?: string, targetType?: '1am' | 'lace') => Promise<ConnectedSession | undefined>;
  disconnect: () => void;
  clearError: () => void;
};

// ---------------------------------------------------------------------------
// Wallet Discovery Helpers
// Resilient to CAIP-372 / CIP-30 UUID keys, direct namespace keys, & legacy keys
// ---------------------------------------------------------------------------
export function detectMidnightWallets(): DiscoveredWallet[] {
  if (typeof window === 'undefined') return [];
  const results: DiscoveredWallet[] = [];
  const midnight = (window as any).midnight;

  // 1. Check direct keys on window.midnight
  if (midnight && typeof midnight === 'object') {
    // Check direct 1AM keys
    const direct1am =
      midnight['1am'] ||
      midnight['1AM'] ||
      midnight.oneAm ||
      midnight['one-am'] ||
      midnight['1am-wallet'];
    if (direct1am && (typeof direct1am.connect === 'function' || typeof direct1am.enable === 'function')) {
      results.push({
        id: '1am-direct',
        name: direct1am.name || '1AM Wallet',
        type: '1am',
        raw: direct1am,
      });
    }

    // Check direct Lace keys
    const directLace = midnight.mnLace || midnight.lace;
    if (directLace && (typeof directLace.connect === 'function' || typeof directLace.enable === 'function')) {
      results.push({
        id: 'lace-direct',
        name: directLace.name || 'Lace Wallet',
        type: 'lace',
        raw: directLace,
      });
    }

    // Spec compliance: Iterate over all keys (UUIDs or RDNS) in window.midnight
    for (const [key, val] of Object.entries(midnight)) {
      if (!val || typeof val !== 'object') continue;
      const v = val as any;
      const hasConnect = typeof v.connect === 'function' || typeof v.enable === 'function';
      if (!hasConnect) continue;

      // Avoid duplicates from direct checks
      if (results.some((r) => r.raw === v)) continue;

      const name = String(v.name || '').toLowerCase();
      const rdns = String(v.rdns || '').toLowerCase();
      const lowerKey = key.toLowerCase();

      if (name.includes('1am') || rdns.includes('1am') || lowerKey.includes('1am')) {
        results.push({
          id: key,
          name: v.name || '1AM Wallet',
          type: '1am',
          raw: v,
        });
      } else if (name.includes('lace') || rdns.includes('lace') || lowerKey.includes('lace') || lowerKey.includes('mnlace')) {
        results.push({
          id: key,
          name: v.name || 'Lace Wallet',
          type: 'lace',
          raw: v,
        });
      } else {
        results.push({
          id: key,
          name: v.name || `Midnight Wallet (${key.slice(0, 8)})`,
          type: 'other',
          raw: v,
        });
      }
    }
  }

  // 2. Check window-level globals for 1AM
  const win1am = (window as any)['1am'] || (window as any).oneAm;
  if (win1am && (typeof win1am.connect === 'function' || typeof win1am.enable === 'function')) {
    if (!results.some((r) => r.raw === win1am)) {
      results.push({
        id: 'window-1am',
        name: win1am.name || '1AM Wallet',
        type: '1am',
        raw: win1am,
      });
    }
  }

  // 3. Check window.lace?.midnight
  const winLace = (window as any).lace?.midnight;
  if (winLace && (typeof winLace.connect === 'function' || typeof winLace.enable === 'function')) {
    if (!results.some((r) => r.raw === winLace)) {
      results.push({
        id: 'window-lace',
        name: winLace.name || 'Lace Wallet',
        type: 'lace',
        raw: winLace,
      });
    }
  }

  return results;
}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------
const WalletContext = createContext<WalletContextType | null>(null);

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------
export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [address, setAddress] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [walletType, setWalletType] = useState<WalletType>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [walletStatus, setWalletStatus] = useState<WalletStatus>('checking');
  const [walletError, setWalletError] = useState<string | null>(null);
  const [availableWallets, setAvailableWallets] = useState<DiscoveredWallet[]>([]);
  const [session, setSession] = useState<ConnectedSession | null>(null);
  const connectingRef = useRef(false);

  const clearError = useCallback(() => setWalletError(null), []);

  // Poll for wallet injection — runs on mount and listens for window events
  useEffect(() => {
    const startedAt = Date.now();

    const check = () => {
      const wallets = detectMidnightWallets();
      if (wallets.length > 0) {
        setAvailableWallets(wallets);
        // Prefer 1AM if available, otherwise Lace, or first detected
        const preferred = wallets.find((w) => w.type === '1am') || wallets.find((w) => w.type === 'lace') || wallets[0];
        setWalletType(preferred.type);
        setWalletStatus('detected');
        return true;
      }
      return false;
    };

    if (check()) return;

    const id = setInterval(() => {
      if (check()) {
        clearInterval(id);
        return;
      }
      if (Date.now() - startedAt >= 8000) {
        setWalletStatus('not-found');
        clearInterval(id);
      }
    }, 250);

    const onWindowLoad = () => check();
    window.addEventListener('load', onWindowLoad);

    return () => {
      clearInterval(id);
      window.removeEventListener('load', onWindowLoad);
    };
  }, []);

  const connect = useCallback(async (network = 'preprod', targetType?: '1am' | 'lace') => {
    if (connectingRef.current) return;
    connectingRef.current = true;
    setIsConnecting(true);
    setWalletError(null);

    try {
      // Re-scan in case the wallet injected right when user clicked
      let wallets = detectMidnightWallets();
      if (wallets.length === 0) {
        // Give 1AM extension 600ms grace period to finish content script handshake
        await new Promise((r) => setTimeout(r, 600));
        wallets = detectMidnightWallets();
      }

      setAvailableWallets(wallets);

      if (wallets.length === 0) {
        const midnightKeys = Object.keys((window as any).midnight || {});
        throw new Error(
          `No Midnight wallet found in browser. If 1AM or Lace is installed, please unlock the extension and refresh this page. (window.midnight keys: [${midnightKeys.join(', ')}])`,
        );
      }

      // Determine target wallet
      const selected =
        (targetType ? wallets.find((w) => w.type === targetType) : null) ||
        wallets.find((w) => w.type === '1am') ||
        wallets.find((w) => w.type === 'lace') ||
        wallets[0];

      const wallet = selected.raw;
      console.log(`[ScholarshipVault Wallet] Connecting to ${selected.name} (${selected.type}) on network: ${network}`);

      let api: any = null;

      // Invocation strategy 1: wallet.connect(network)
      if (typeof wallet.connect === 'function') {
        try {
          api = await wallet.connect(network);
        } catch (firstErr: any) {
          console.warn('[ScholarshipVault Wallet] wallet.connect(network) failed, retrying without arguments:', firstErr);
          // Invocation strategy 2: wallet.connect() without network argument
          try {
            api = await wallet.connect();
          } catch (secondErr: any) {
            console.warn('[ScholarshipVault Wallet] wallet.connect() without args failed, checking enable():', secondErr);
            // Invocation strategy 3: wallet.enable()
            if (typeof wallet.enable === 'function') {
              try {
                api = await wallet.enable(network);
              } catch {
                api = await wallet.enable();
              }
            } else {
              throw firstErr;
            }
          }
        }
      } else if (typeof wallet.enable === 'function') {
        try {
          api = await wallet.enable(network);
        } catch {
          api = await wallet.enable();
        }
      } else {
        throw new Error(`Wallet ${selected.name} found, but neither .connect() nor .enable() method is available.`);
      }

      if (!api) {
        throw new Error(`Wallet ${selected.name} did not return a valid API session.`);
      }

      console.log('[ScholarshipVault Wallet] Connected successfully to wallet API:', api);

      const sess = await createConnectedSession(api);
      setSession(sess);
      setAddress(sess.unshieldedAddress || null);
      setWalletType(selected.type);
      setIsConnected(true);
      return sess;
    } catch (err: any) {
      console.error('[ScholarshipVault Wallet] Connection error:', err);
      const msg = err?.message || String(err);
      setWalletError(msg);
      throw err;
    } finally {
      connectingRef.current = false;
      setIsConnecting(false);
    }
  }, []);

  const disconnect = useCallback(() => {
    setAddress(null);
    setIsConnected(false);
    setSession(null);
    setWalletStatus('checking');
    setWalletType(null);
    setWalletError(null);

    // Re-check for wallets after disconnect
    setTimeout(() => {
      const wallets = detectMidnightWallets();
      setAvailableWallets(wallets);
      if (wallets.length > 0) {
        setWalletType(wallets[0].type);
        setWalletStatus('detected');
      } else {
        setWalletStatus('not-found');
      }
    }, 300);
  }, []);

  return (
    <WalletContext.Provider
      value={{
        address,
        isConnected,
        walletType,
        isConnecting,
        walletStatus,
        walletError,
        availableWallets,
        session,
        connect,
        disconnect,
        clearError,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------
export function useWallet(): WalletContextType {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error('useWallet must be used within a WalletProvider');
  return ctx;
}
