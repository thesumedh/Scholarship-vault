import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { WebSocket } from 'ws';
import { setNetworkId } from '@midnight-ntwrk/midnight-js-network-id';
import {
  deployContract,
  submitCallTx,
  type DeployedContract,
} from '@midnight-ntwrk/midnight-js-contracts';
import type { ContractAddress } from '@midnight-ntwrk/midnight-js-protocol/compact-runtime';
import {
  type EnvironmentConfiguration,
  waitForFunds,
} from '@midnight-ntwrk/testkit-js';
import pino from 'pino';

import { getConfig } from '../config.js';
import {
  MidnightWalletProvider,
  syncWallet,
  type WalletSecret,
} from '../wallet.js';
import { buildProviders, type ScholarshipProviders } from '../providers.js';
import {
  CompiledScholarshipContract,
  Contract,
  ledger,
  zkConfigPath,
} from '../../contracts/index.js';

// Required for GraphQL subscriptions in Node.js
// @ts-expect-error WebSocket global assignment for apollo
globalThis.WebSocket = WebSocket;

process.on('unhandledRejection', (reason, promise) => {
  console.error('UNHANDLED REJECTION:', reason);
  console.error('Promise:', promise);
});

process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION:', err);
});

const ALICE_LOCAL_SEED =
  '0000000000000000000000000000000000000000000000000000000000000001';
const PRIVATE_STATE_ID = 'AlicePrivateScholarshipState';

const logger = pino({
  level: process.env['LOG_LEVEL'] ?? 'info',
  transport: { target: 'pino-pretty' },
});

const network = process.env['MIDNIGHT_NETWORK'] ?? 'local';

function resolveSecret(net: string): WalletSecret {
  if (net === 'local') return { kind: 'seed', value: ALICE_LOCAL_SEED };

  const upper = net.toUpperCase();
  const mnemonicEnv = `MIDNIGHT_${upper}_MNEMONIC`;
  const seedEnv = `MIDNIGHT_${upper}_SEED`;
  const mnemonic = process.env[mnemonicEnv]?.trim().replace(/\s+/g, ' ');
  const seedHex = process.env[seedEnv]?.trim();

  if (mnemonic && seedHex) {
    throw new Error(
      `Set only one of ${mnemonicEnv} or ${seedEnv} (both are defined).`,
    );
  }
  if (mnemonic) {
    return { kind: 'mnemonic', value: mnemonic };
  }
  if (seedHex) {
    if (!/^[0-9a-fA-F]+$/.test(seedHex) || seedHex.length % 2 !== 0) {
      throw new Error(
        `${seedEnv} must be a hex string of even length (no 0x prefix).`,
      );
    }
    return { kind: 'seed', value: seedHex };
  }
  throw new Error(
    `Either ${mnemonicEnv} or ${seedEnv} is required for network '${net}'. ` +
      `Set one in .env.${net} or the shell.`,
  );
}

describe(`Scholarship Contract (${network})`, () => {
  let wallet: MidnightWalletProvider;
  let providers: ScholarshipProviders;
  let contractAddress: ContractAddress;

  const config = getConfig();
  const secret = resolveSecret(network);
  const isRemote = config.faucet !== '';
  const syncTimeoutMs = Number(
    process.env['MIDNIGHT_SYNC_TIMEOUT_MS'] ??
      (isRemote ? 60 * 60_000 : 10 * 60_000),
  );

  async function queryLedger(p: ScholarshipProviders) {
    const state = await p.publicDataProvider.queryContractState(contractAddress);
    expect(state).not.toBeNull();
    return ledger(state!.data);
  }

  beforeAll(async () => {
    setNetworkId(config.networkId);

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

    wallet = await MidnightWalletProvider.build(logger, envConfig, secret);
    await wallet.start();
    await syncWallet(logger, wallet.wallet, syncTimeoutMs);

    if (isRemote) {
      const nightBalance = await waitForFunds(
        wallet.wallet,
        envConfig,
        true,
        wallet.unshieldedKeystore,
      );
      logger.info(`Wallet NIGHT balance on '${network}': ${nightBalance}`);
    }

    providers = buildProviders(wallet, zkConfigPath, config);
    logger.info(`Providers initialized on '${network}'. Ready to test!`);
  });

  afterAll(async () => {
    if (wallet) {
      logger.info('Stopping wallet...');
      await wallet.stop();
    }
  });

  it('Deploys the contract with scholarship rules', async () => {
    logger.info(`Deploying Scholarship Contract...`);

    // Minimum GPA: 8.0 (scaled to 800), Max Income: 250,000 INR
    const minGpa = 800n;
    const maxIncome = 250000n;

    const deployed: DeployedContract<Contract> =
      await (deployContract<Contract>)(providers, {
        compiledContract: CompiledScholarshipContract,
        privateStateId: PRIVATE_STATE_ID,
        initialPrivateState: {},
        args: [minGpa, maxIncome],
      });

    contractAddress = deployed.deployTxData.public.contractAddress;
    logger.info(`Contract deployed at: ${contractAddress}`);
    expect(contractAddress).toBeDefined();

    const state = await queryLedger(providers);
    expect(state.min_gpa).toEqual(minGpa);
    expect(state.max_income).toEqual(maxIncome);
  });

  it('Verifies eligibility successfully for a qualifying student', async () => {
    // Student GPA: 9.1 (910), Income: 180,000 (qualifies!)
    logger.info(`Running verify_eligibility for qualifying student...`);

    await (submitCallTx<Contract, 'verify_eligibility'>)(providers, {
      compiledContract: CompiledScholarshipContract,
      contractAddress,
      privateStateId: PRIVATE_STATE_ID,
      circuitId: 'verify_eligibility',
      args: [910n, 180000n],
    });

    logger.info(`Verification transaction completed successfully.`);
  });

  it('Fails verification for a student with GPA too low', async () => {
    // Student GPA: 7.5 (750), Income: 180,000 (fails!)
    logger.info(`Running verify_eligibility for low GPA student (should fail)...`);

    await expect(
      (submitCallTx<Contract, 'verify_eligibility'>)(providers, {
        compiledContract: CompiledScholarshipContract,
        contractAddress,
        privateStateId: PRIVATE_STATE_ID,
        circuitId: 'verify_eligibility',
        args: [750n, 180000n],
      })
    ).rejects.toThrow();

    logger.info(`Rejected low GPA student as expected.`);
  });

  it('Fails verification for a student with income too high', async () => {
    // Student GPA: 9.1 (910), Income: 300,000 (fails!)
    logger.info(`Running verify_eligibility for high income student (should fail)...`);

    await expect(
      (submitCallTx<Contract, 'verify_eligibility'>)(providers, {
        compiledContract: CompiledScholarshipContract,
        contractAddress,
        privateStateId: PRIVATE_STATE_ID,
        circuitId: 'verify_eligibility',
        args: [910n, 300000n],
      })
    ).rejects.toThrow();

    logger.info(`Rejected high income student as expected.`);
  });
});
