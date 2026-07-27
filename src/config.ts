export type NetworkConfig = {
  networkId: string;
  indexer: string;
  indexerWS: string;
  node: string;
  nodeWS: string;
  proofServer: string;
  faucet: string;
};

export const LOCAL_CONFIG: NetworkConfig = {
  networkId: 'undeployed',
  indexer: 'http://127.0.0.1:8088/api/v4/graphql',
  indexerWS: 'ws://127.0.0.1:8088/api/v4/graphql/ws',
  node: 'http://127.0.0.1:9944',
  nodeWS: 'ws://127.0.0.1:9944',
  proofServer: 'http://127.0.0.1:6300',
  faucet: '',
};

export const PREVIEW_CONFIG: NetworkConfig = {
  networkId: 'preview',
  indexer: 'https://indexer.preview.midnight.network/api/v4/graphql',
  indexerWS: 'wss://indexer.preview.midnight.network/api/v4/graphql/ws',
  node: 'https://rpc.preview.midnight.network',
  nodeWS: 'wss://rpc.preview.midnight.network',
  proofServer: process.env['MIDNIGHT_PROOF_SERVER'] ?? 'http://127.0.0.1:6300',
  faucet: 'https://faucet.preview.midnight.network/api/drips',
};

export const PREPROD_CONFIG: NetworkConfig = {
  networkId: 'preprod',
  indexer: 'https://indexer.preprod.midnight.network/api/v4/graphql',
  indexerWS: 'wss://indexer.preprod.midnight.network/api/v4/graphql/ws',
  node: 'https://rpc.preprod.midnight.network',
  nodeWS: 'wss://rpc.preprod.midnight.network',
  proofServer: process.env['MIDNIGHT_PROOF_SERVER'] ?? 'http://127.0.0.1:6300',
  faucet: 'https://faucet.preprod.midnight.network/api/drips',
};

export function getConfig(): NetworkConfig {
  const network = process.env['MIDNIGHT_NETWORK'] ?? 'local';
  if (network === 'local') return LOCAL_CONFIG;
  if (network === 'preview') return PREVIEW_CONFIG;
  if (network === 'preprod') return PREPROD_CONFIG;
  throw new Error(
    `Unknown network: ${network}. Supported: 'local', 'preview', 'preprod'.`,
  );
}
