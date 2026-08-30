import pino from 'pino';
import { WebSocket } from 'ws';
import { setNetworkId } from '@midnight-ntwrk/midnight-js-network-id';
import { deployContract, type DeployedContract } from '@midnight-ntwrk/midnight-js-contracts';
import axios from 'axios';
import * as Rx from 'rxjs';
import { unshieldedToken } from '@midnight-ntwrk/ledger-v8';
import { getConfig } from '../src/config.js';
import { MidnightWalletProvider, syncWallet, type WalletSecret } from '../src/wallet.js';
import { buildProviders } from '../src/providers.js';
import { CompiledScholarshipContract, Contract, zkConfigPath } from '../contracts/index.js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// @ts-expect-error WebSocket global assignment for apollo
globalThis.WebSocket = WebSocket;

process.on('unhandledRejection', (reason, promise) => {
  console.error('UNHANDLED REJECTION:', reason);
});

process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION:', err);
});

const logger = pino({
  level: process.env['LOG_LEVEL'] ?? 'info',
  transport: { target: 'pino-pretty' },
});

const network = process.env['MIDNIGHT_NETWORK'] ?? 'local';
const PRIVATE_STATE_ID = 'AlicePrivateScholarshipState';

async function ensureDustFunds(wallet: MidnightWalletProvider, faucetUrl: string, syncTimeoutMs: number) {
  const unshieldedAddr = wallet.unshieldedKeystore.getBech32Address().asString();
  logger.info(`Unshielded wallet address: ${unshieldedAddr}`);

  let state = await Rx.firstValueFrom(wallet.wallet.state());
  const unshieldedRaw = unshieldedToken().raw;
  let nightBalance = state.unshielded.balances[unshieldedRaw] ?? 0n;
  logger.info(`Current NIGHT balance: ${nightBalance}`);

  if (nightBalance === 0n && faucetUrl) {
    logger.info(`Requesting tNIGHT from faucet: ${faucetUrl}...`);
    try {
      await axios.post(faucetUrl, { address: unshieldedAddr });
      logger.info('Faucet drip requested successfully.');
    } catch (e: any) {
      logger.warn(`Faucet request response: ${e?.response?.data ?? e?.message ?? e}`);
    }

    logger.info('Waiting for faucet transaction to appear on-chain...');
    await syncWallet(logger, wallet.wallet, syncTimeoutMs);
    state = await Rx.firstValueFrom(wallet.wallet.state());
    nightBalance = state.unshielded.balances[unshieldedRaw] ?? 0n;
    logger.info(`Updated NIGHT balance: ${nightBalance}`);
  }

  const dustCoins = state.dust.availableCoins.length;
  const dustBal = state.dust.balance(new Date());
  logger.info(`Available DUST coins: ${dustCoins}, DUST balance: ${dustBal}`);
  logger.info(`Unshielded availableCoins count: ${state.unshielded.availableCoins.length}`);
  logger.info(`Unshielded availableCoins: ${JSON.stringify(state.unshielded.availableCoins)}`);

  if (dustCoins === 0) {
    logger.info(`Registering ${state.unshielded.availableCoins.length} NIGHT UTXO(s) to generate spendable DUST...`);
    const recipe = await wallet.wallet.registerNightUtxosForDustGeneration(
      state.unshielded.availableCoins,
      wallet.unshieldedKeystore.getPublicKey(),
      (payload) => wallet.unshieldedKeystore.signData(payload),
    );
    const finalized = await wallet.wallet.finalizeRecipe(recipe);
    const txId = await wallet.wallet.submitTransaction(finalized);
    logger.info(`DUST registration transaction submitted: ${txId}`);

    logger.info('Waiting for DUST registration to confirm on-chain...');
    await syncWallet(logger, wallet.wallet, syncTimeoutMs);
    
    const newState = await Rx.firstValueFrom(wallet.wallet.state());
    logger.info(`New DUST coins: ${newState.dust.availableCoins.length}, balance: ${newState.dust.balance(new Date())}`);
  }
}

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

    logger.info(`Checking NIGHT and DUST funds for deployment...`);
    await ensureDustFunds(wallet, config.faucet, syncTimeoutMs);

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
    logger.error(`Deployment failed: ${err?.stack ?? err?.message ?? JSON.stringify(err)}`);
    process.exitCode = 1;
  } finally {
    await wallet.stop();
  }
}

main().catch((err) => {
  logger.error(err);
  process.exitCode = 1;
});
