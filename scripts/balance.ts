import { setNetworkId } from '@midnight-ntwrk/midnight-js-network-id';
import type { EnvironmentConfiguration } from '@midnight-ntwrk/testkit-js';
import { getConfig } from '../src/config.js';
import { MidnightWalletProvider, type WalletSecret } from '../src/wallet.js';
import pino from 'pino';
import * as Rx from 'rxjs';

const logger = pino({ level: 'info', transport: { target: 'pino-pretty' } });
const network = process.env['MIDNIGHT_NETWORK'] ?? 'local';

function resolveSecret(net: string): WalletSecret {
  const mnemonic = process.env[`MIDNIGHT_${net.toUpperCase()}_MNEMONIC`]?.trim().replace(/\s+/g, ' ');
  if (mnemonic) return { kind: 'mnemonic', value: mnemonic };
  throw new Error('No mnemonic');
}

async function main() {
  const config = getConfig();
  setNetworkId(config.networkId);
  const secret = resolveSecret(network);
  const envConfig: EnvironmentConfiguration = {
    walletNetworkId: config.networkId,
    networkId: config.networkId,
    indexer: config.indexer,
    indexerWS: config.indexerWS,
    node: config.node,
    nodeWS: config.nodeWS,
    faucet: config.faucet,
    proofServer: config.proofServer,
  };

  const provider = await MidnightWalletProvider.build(logger, envConfig, secret);
  await provider.wallet.start();
  
  const state = await Rx.firstValueFrom(provider.wallet.state());
  console.log('Unshielded balance:', state.unshielded.balances);
  console.log('Shielded balance:', state.shielded.state.balances);
  
  await provider.wallet.stop();
}

main().catch(console.error);
