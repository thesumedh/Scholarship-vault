import pino from 'pino';
import { setNetworkId } from '@midnight-ntwrk/midnight-js-network-id';
import { deployContract, type DeployedContract } from '@midnight-ntwrk/midnight-js-contracts';
import type { EnvironmentConfiguration } from '@midnight-ntwrk/testkit-js';
import { getConfig } from '../src/config.js';
import { MidnightWalletProvider, syncWallet, type WalletSecret } from '../src/wallet.js';
import { buildProviders } from '../src/providers.js';
import { CompiledScholarshipContract, Contract, zkConfigPath } from '../contracts/index.js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const logger = pino({
  level: process.env['LOG_LEVEL'] ?? 'info',
  transport: { target: 'pino-pretty' },
});

const network = process.env['MIDNIGHT_NETWORK'] ?? 'local';
const PRIVATE_STATE_ID = 'AlicePrivateScholarshipState';

function resolveSecret(net: string): WalletSecret {
  const upper = net.toUpperCase();
  const mnemonicEnv = `MIDNIGHT_${upper}_MNEMONIC`;
  const seedEnv = `MIDNIGHT_${upper}_SEED`;
  const mnemonic = process.env[mnemonicEnv]?.trim().replace(/\s+/g, ' ');
  const seedHex = process.env[seedEnv]?.trim();

  if (mnemonic && seedHex) {
    throw new Error(`Set only one of ${mnemonicEnv} or ${seedEnv} (both are defined).`);
  }
  if (mnemonic) {
    return { kind: 'mnemonic', value: mnemonic };
  }
  if (seedHex) {
    if (!/^[0-9a-fA-F]+$/.test(seedHex) || seedHex.length % 2 !== 0) {
      throw new Error(`${seedEnv} must be a hex string of even length (no 0x prefix).`);
    }
    return { kind: 'seed', value: seedHex };
  }
  throw new Error(
    `Either ${mnemonicEnv} or ${seedEnv} is required for network '${net}'. Set one in environment or .env.${net} file.`
  );
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

  logger.info(`Connecting and syncing wallet on ${network}...`);
  const wallet = await MidnightWalletProvider.build(logger, envConfig, secret);
  await wallet.start();

  try {
    const syncTimeoutMs = 30 * 60_000; // 30 minutes
    await syncWallet(logger, wallet.wallet, syncTimeoutMs);

    logger.info(`Building providers...`);
    const providers = buildProviders(wallet, zkConfigPath, config);

    // Initial deployment rules (GPA >= 8.0, Income <= 250,000 INR)
    const minGpa = 800n;
    const maxIncome = 250000n;
    
    logger.info(`Deploying Scholarship Smart Contract to ${network}...`);
    const deployed = await deployContract<Contract>(providers, {
      compiledContract: CompiledScholarshipContract,
      privateStateId: PRIVATE_STATE_ID,
      initialPrivateState: {},
      args: [minGpa, maxIncome],
    });

    const address = deployed.deployTxData.public.contractAddress;
    logger.info(`SUCCESS! Contract deployed at: ${address}`);

    // Save deployed address for frontend use
    const currentDir = path.dirname(fileURLToPath(import.meta.url));
    const outputDir = path.resolve(currentDir, '..', 'contracts', 'managed');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    fs.writeFileSync(path.resolve(outputDir, 'preprod-address.txt'), address);
    logger.info(`Saved address to contracts/managed/preprod-address.txt`);
  } catch (err: any) {
    logger.error(`Deployment failed: ${err.message || err}`);
  } finally {
    await wallet.stop();
  }
}

main().catch((err) => {
  logger.error(err);
  process.exitCode = 1;
});
