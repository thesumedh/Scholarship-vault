import { setNetworkId } from '@midnight-ntwrk/midnight-js-network-id';
import { FetchZkConfigProvider } from '@midnight-ntwrk/midnight-js-fetch-zk-config-provider';
import { indexerPublicDataProvider } from '@midnight-ntwrk/midnight-js-indexer-public-data-provider';
import { ContractState } from '@midnight-ntwrk/compact-runtime';
import type { MidnightProvider, WalletProvider } from '@midnight-ntwrk/midnight-js-types';

// ---------------------------------------------------------------------------
// Hex helpers — never skip padStart
// ---------------------------------------------------------------------------
export function toHex(bytes: Uint8Array): string {
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
}

export function fromHex(hex: string): Uint8Array {
  const normalized = hex.startsWith('0x') ? hex.slice(2) : hex;
  if (normalized.length % 2 !== 0) throw new Error('Invalid hex string from wallet.');
  const bytes = new Uint8Array(normalized.length / 2);
  for (let i = 0; i < normalized.length; i += 2) {
    bytes[i / 2] = parseInt(normalized.slice(i, i + 2), 16);
  }
  return bytes;
}

// ---------------------------------------------------------------------------
// Patched Public Data Provider
// Fixes the `offset: null` GraphQL bug on preprod/preview indexers.
// ---------------------------------------------------------------------------
export function createPatchedPublicDataProvider(queryUrl: string, subscriptionUrl: string) {
  const base = indexerPublicDataProvider(queryUrl, subscriptionUrl);

  async function queryLatest(query: string, address: string) {
    const res = await fetch(queryUrl, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ query, variables: { address } }),
    });
    if (!res.ok) throw new Error(`Indexer HTTP error: ${res.status}`);
    const payload = await res.json();
    if (payload.errors?.length) throw new Error(payload.errors.map((e: any) => e.message).join('; '));
    return payload.data?.contractAction ?? null;
  }

  return {
    ...base,
    async queryContractState(contractAddress: string, config?: any) {
      if (config) return base.queryContractState(contractAddress, config);
      const action = await queryLatest(
        `query LATEST_CONTRACT_STATE($address: HexEncoded!) {
          contractAction(address: $address) { state }
        }`,
        contractAddress,
      );
      return action ? ContractState.deserialize(fromHex(action.state)) : null;
    },
  };
}

// ---------------------------------------------------------------------------
// In-memory Private State Provider
// ---------------------------------------------------------------------------
export function createPrivateStateProvider() {
  let scope = '';
  const stateStore = new Map<string, unknown>();
  const signingKeyStore = new Map<string, unknown>();
  const key = (id: string) => `${scope}:${id}`;

  return {
    setContractAddress(address: string) { scope = address; },
    async set(id: string, state: unknown) { stateStore.set(key(id), state); },
    async get(id: string) { return stateStore.get(key(id)) ?? null; },
    async remove(id: string) { stateStore.delete(key(id)); },
    async clear() { stateStore.clear(); },
    async setSigningKey(addr: string, k: unknown) { signingKeyStore.set(addr, k); },
    async getSigningKey(addr: string) { return signingKeyStore.get(addr) ?? null; },
    async removeSigningKey(addr: string) { signingKeyStore.delete(addr); },
    async clearSigningKeys() { signingKeyStore.clear(); },
    async exportPrivateStates(): Promise<never> { throw new Error('Not implemented.'); },
    async importPrivateStates(): Promise<never> { throw new Error('Not implemented.'); },
    async exportSigningKeys(): Promise<never> { throw new Error('Not implemented.'); },
    async importSigningKeys(): Promise<never> { throw new Error('Not implemented.'); },
  };
}

// ---------------------------------------------------------------------------
// Connected Session Type
// ---------------------------------------------------------------------------
export type ConnectedSession = {
  api: any;
  config: any;
  providers: {
    privateStateProvider: ReturnType<typeof createPrivateStateProvider>;
    publicDataProvider: ReturnType<typeof createPatchedPublicDataProvider>;
    zkConfigProvider: FetchZkConfigProvider;
    proofProvider: { proveTx: (unprovenTx: any, _config: any) => Promise<any> };
    walletProvider: WalletProvider;
    midnightProvider: MidnightProvider;
  };
  unshieldedAddress: string;
};

// ---------------------------------------------------------------------------
// Main session factory — call after wallet.connect()
// Resilient to both 1AM and Lace wallet connector specifications
// ---------------------------------------------------------------------------
export async function createConnectedSession(api: any): Promise<ConnectedSession> {
  // Defensive helper to parse unshielded address from string, object, or array
  const extractAddress = (raw: any): string => {
    if (!raw) return '';
    if (typeof raw === 'string') return raw;
    if (typeof raw.unshieldedAddress === 'string') return raw.unshieldedAddress;
    if (typeof raw.address === 'string') return raw.address;
    if (Array.isArray(raw) && raw.length > 0) return extractAddress(raw[0]);
    return '';
  };

  // Defensive helper for shielded keys
  const extractShielded = (raw: any): { coinPublicKey: string; encryptionPublicKey: string } => {
    const item = Array.isArray(raw) ? raw[0] : raw;
    return {
      coinPublicKey: item?.shieldedCoinPublicKey || item?.coinPublicKey || '',
      encryptionPublicKey: item?.shieldedEncryptionPublicKey || item?.encryptionPublicKey || '',
    };
  };

  // Safe parallel queries with individual try-catch to prevent a single missing field from failing session creation
  const [configRes, unshieldedRes, shieldedRes] = await Promise.all([
    Promise.resolve().then(async () => {
      if (typeof api.getConfiguration === 'function') {
        return await api.getConfiguration();
      }
      return null;
    }).catch((err) => {
      console.warn('[ScholarshipVault] api.getConfiguration() notice:', err);
      return null;
    }),
    Promise.resolve().then(async () => {
      if (typeof api.getUnshieldedAddress === 'function') {
        return await api.getUnshieldedAddress();
      }
      if (typeof api.getUnshieldedAddresses === 'function') {
        return await api.getUnshieldedAddresses();
      }
      return null;
    }).catch((err) => {
      console.warn('[ScholarshipVault] api.getUnshieldedAddress() notice:', err);
      return null;
    }),
    Promise.resolve().then(async () => {
      if (typeof api.getShieldedAddresses === 'function') {
        return await api.getShieldedAddresses();
      }
      if (typeof api.getShieldedAddress === 'function') {
        return await api.getShieldedAddress();
      }
      return null;
    }).catch((err) => {
      console.warn('[ScholarshipVault] api.getShieldedAddresses() notice:', err);
      return null;
    }),
  ]);

  const config = {
    networkId: configRes?.networkId || 'preprod',
    indexerUri: configRes?.indexerUri || 'https://indexer.preprod.midnight.network/api/v1/graphql',
    indexerWsUri: configRes?.indexerWsUri || 'wss://indexer.preprod.midnight.network/api/v1/graphql/ws',
    proverServerUri: configRes?.proverServerUri || 'http://127.0.0.1:6300',
    ...(configRes || {}),
  };

  // Must be called before any SDK operations
  try {
    setNetworkId(config.networkId);
  } catch (err) {
    console.warn('[ScholarshipVault] setNetworkId note:', err);
  }

  // ZK assets are served from /managed relative to origin
  const zkConfigProvider = new FetchZkConfigProvider(
    new URL('/managed', window.location.origin).toString(),
    window.fetch.bind(window),
  );

  // Safe proving provider initialization
  let provingProvider: any = null;
  if (typeof api.getProvingProvider === 'function') {
    try {
      provingProvider = await api.getProvingProvider(zkConfigProvider);
    } catch (err) {
      console.warn('[ScholarshipVault] api.getProvingProvider failed, falling back to ledger prover:', err);
    }
  }

  const proofProvider = {
    async proveTx(unprovenTx: any, _config: any) {
      const { CostModel } = await import('@midnight-ntwrk/ledger-v8');
      if (provingProvider) {
        return unprovenTx.prove(provingProvider, CostModel.initialCostModel());
      }
      if (typeof unprovenTx.prove === 'function') {
        return unprovenTx.prove(provingProvider, CostModel.initialCostModel());
      }
      throw new Error('No proving provider available from wallet or proof server.');
    },
  };

  const shieldedKeys = extractShielded(shieldedRes);

  const walletProvider: WalletProvider = {
    getCoinPublicKey: () => shieldedKeys.coinPublicKey,
    getEncryptionPublicKey: () => shieldedKeys.encryptionPublicKey,
    balanceTx: async (tx: any) => {
      const txHex = toHex(tx.serialize());
      const balanceFn = api.balanceUnsealedTransaction || api.balanceTransaction || api.balanceTx;
      if (typeof balanceFn !== 'function') {
        throw new Error('Connected wallet does not support balancing unsealed transactions.');
      }
      const balanced = await balanceFn.call(api, txHex);
      const rawHex = typeof balanced === 'string' ? balanced : (balanced?.tx || balanced?.transaction);
      if (!rawHex) throw new Error('balanceUnsealedTransaction returned invalid result');
      const { Transaction } = await import('@midnight-ntwrk/ledger-v8');
      return Transaction.deserialize('signature', 'proof', 'binding', fromHex(rawHex));
    },
  };

  const midnightProvider: MidnightProvider = {
    submitTx: async (tx: any) => {
      const txHex = toHex(tx.serialize());
      const submitFn = api.submitTransaction || api.submitTx;
      if (typeof submitFn !== 'function') {
        throw new Error('Connected wallet does not support submitting transactions.');
      }
      const result = await submitFn.call(api, txHex);
      if (typeof result === 'string' && result) return result;
      if (result?.transactionId) return result.transactionId;
      if (result?.id) return result.id;
      if (result?.txHash) return result.txHash;
      return txHex.slice(0, 64);
    },
  };

  const publicDataProvider = createPatchedPublicDataProvider(config.indexerUri, config.indexerWsUri);
  const unshieldedAddress = extractAddress(unshieldedRes);

  return {
    api,
    config,
    providers: {
      privateStateProvider: createPrivateStateProvider(),
      publicDataProvider,
      zkConfigProvider,
      proofProvider,
      walletProvider,
      midnightProvider,
    },
    unshieldedAddress,
  };
}

// ---------------------------------------------------------------------------
// Polling helpers
// ---------------------------------------------------------------------------
export async function waitForContractDeployment(
  publicDataProvider: ReturnType<typeof createPatchedPublicDataProvider>,
  contractAddress: string,
  pollIntervalMs = 2000,
  maxAttempts = 45,
): Promise<void> {
  for (let i = 0; i < maxAttempts; i++) {
    const state = await publicDataProvider.queryContractState(contractAddress);
    if (state?.data) return;
    await new Promise((r) => setTimeout(r, pollIntervalMs));
  }
  throw new Error(`Contract not indexed after ${maxAttempts * pollIntervalMs}ms — check address or indexer lag`);
}
