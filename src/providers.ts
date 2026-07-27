import { type MidnightProviders } from '@midnight-ntwrk/midnight-js-types';
import { indexerPublicDataProvider } from '@midnight-ntwrk/midnight-js-indexer-public-data-provider';
import { httpClientProofProvider } from '@midnight-ntwrk/midnight-js-http-client-proof-provider';
import { NodeZkConfigProvider } from '@midnight-ntwrk/midnight-js-node-zk-config-provider';
import { levelPrivateStateProvider } from '@midnight-ntwrk/midnight-js-level-private-state-provider';
import { type MidnightWalletProvider } from './wallet.js';
import { type NetworkConfig } from './config.js';

export type ScholarshipCircuits = 'verify_eligibility';

export type ScholarshipProviders = MidnightProviders<any>;

export function buildProviders(
    wallet: MidnightWalletProvider,
    zkConfigPath: string,
    config: NetworkConfig,
): ScholarshipProviders {
    const zkConfigProvider = new NodeZkConfigProvider<ScholarshipCircuits>(zkConfigPath);

    return {
        privateStateProvider: levelPrivateStateProvider({
            privateStateStoreName: `scholarship-${Date.now()}`,
            privateStoragePasswordProvider: () => 'Scholarship-Test-Password',
            accountId: wallet.getCoinPublicKey(),
        }),
        publicDataProvider: indexerPublicDataProvider(
            config.indexer,
            config.indexerWS,
        ),
        zkConfigProvider,
        proofProvider: httpClientProofProvider(
            config.proofServer,
            zkConfigProvider,
        ),
        walletProvider: wallet,
        midnightProvider: wallet,
    };
}