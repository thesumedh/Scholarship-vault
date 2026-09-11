# User Onboarding & Preprod Verification — Scholarship Vault

> **Level 5 Submission · Full Moon Builder Journey**
> Real-world User Onboarding Pipeline & On-Chain Verification Tracker

---

## 🚀 Live Preprod Smart Contract Details

Our dedicated smart contract instance is deployed and verifiable on the **Midnight Preprod Network**:

| Parameter | On-Chain Value |
|-----------|----------------|
| **Contract Address** | [`2acabfd90d77a94af7fcab23806b1d5b6da329392d25e0ce6c0766403289bfdc`](https://explorer.1am.xyz/contract/2acabfd90d77a94af7fcab23806b1d5b6da329392d25e0ce6c0766403289bfdc) |
| **Deployment Transaction** | [`2802e4392df75f13adba9844bc1b497a82b83d046576e9c5e7bc1949347a9b5f`](https://explorer.1am.xyz/tx/2802e4392df75f13adba9844bc1b497a82b83d046576e9c5e7bc1949347a9b5f?network=preprod) |
| **Deployment Block** | Block `#2,327,864` |
| **Network** | Midnight Preprod |
| **Explorer Link (1AM)** | [View Contract on 1AM Explorer](https://explorer.1am.xyz/contract/2acabfd90d77a94af7fcab23806b1d5b6da329392d25e0ce6c0766403289bfdc) |
| **Explorer Link (Midnight)** | [View Contract on Midnight Explorer](https://preprod.midnightexplorer.com/contracts/2acabfd90d77a94af7fcab23806b1d5b6da329392d25e0ce6c0766403289bfdc) |
| **Live Web DApp** | [https://scholar-shield-ten.vercel.app/](https://scholar-shield-ten.vercel.app/) |

---

## 👥 Real-World Onboarding Pipeline & Strategy

To satisfy the **Level 5 (Full Moon)** milestone, user onboarding is conducted through our live frontend with real Midnight Preprod wallet users. In accordance with Midnight's privacy model and audit standards, transactions must be authentic and verifiable on-chain.

### Target Milestone: 50 Preprod Users

- **Onboarding Goal:** 50 real Midnight Preprod community users.
- **Onboarding Method:** Manual onboarding via **Lace Wallet (Preprod)** & **1AM Wallet**.
- **Privacy Model:** Each user inputs private GPA and Income locally in their browser. The client-side WASM zk-SNARK circuit asserts:
  $$\text{GPA} \ge 8.00 \quad \land \quad \text{Income} \le \text{₹2,50,000}$$
- **On-Chain Confirmation:** Only valid cryptographic proofs are accepted by circuit `verify_eligibility`. Zero private values are published to the public ledger.

---

## 📋 Step-by-Step User Onboarding Instructions

1. **Install Browser Wallet**:
   - Install [Lace Wallet](https://www.lace.io/) (with Midnight Preprod support) or [1AM Wallet](https://1am.xyz/).
2. **Fund Wallet with Testnet Tokens**:
   - Request testnet tNIGHT via the official [Midnight Preprod Faucet](https://faucet.preprod.midnight.network/).
   - Lace Wallet automatically provides sponsored DUST (`15,000 DUST Sponsored`) for contract execution fees.
3. **Launch Verification Portal**:
   - Open [https://scholar-shield-ten.vercel.app/verify](https://scholar-shield-ten.vercel.app/verify).
4. **Connect Wallet & Enter Credentials**:
   - Enter your GPA (0.00 – 10.00) and Annual Family Income (INR).
   - The UI evaluates constraints in real time before submission.
5. **Submit Zero-Knowledge Proof**:
   - Click **Submit ZK Proof to Preprod** and approve the transaction in Lace.
   - The transaction is confirmed on-chain on contract `2acabfd9...`.
6. **Submit User Feedback**:
   - Share structured onboarding feedback via our [Feedback Form](./FEEDBACK.md) or on 𝕏 [@ScholrshipVault](https://x.com/ScholrshipVault).

---

## 📝 User Verification Registry (Live Preprod Onboarding Cohort)

*Below is the onboarding registry for wallet addresses participating in the Level 5 verification cohort on contract `2acabfd90d77a94af7fcab23806b1d5b6da329392d25e0ce6c0766403289bfdc`:*

| # | User Wallet Address | On-Chain Verification Status | Submission TX Hash | Cohort Date | Feedback Status |
|---|---------------------|------------------------------|--------------------|-------------|-----------------|
| 1 | `mn_addr_preprod1ynsnwgcla99hejv7q8v26d76euuwuq6xrv47dmzcagj2japchtnqh2fcup` | ✅ Contract Deployer Verified | `2802e4392df75f13adba9844bc1b497a82b83d046576e9c5e7bc1949347a9b5f` | 2026-08-30 | Initial Deployment & Setup |
| 2 | *Community Tester #2* | 🔄 In Progress | Pending Confirmation | Active Cohort | Awaiting Submission |
| 3 | *Community Tester #3* | 🔄 In Progress | Pending Confirmation | Active Cohort | Awaiting Submission |
| … | *Community Testers (4–50)* | 🔄 In Progress | Onboarding Active | Active Cohort | Scheduled Cohort Batch |

*All verified transactions can be cross-referenced directly in the [1AM Preprod Explorer](https://explorer.1am.xyz/contract/2acabfd90d77a94af7fcab23806b1d5b6da329392d25e0ce6c0766403289bfdc).*

---

## 🔒 Automated vs Manual Onboarding: Technical Assessment

During development, we thoroughly evaluated whether creating, funding, and submitting transactions from 50 headless wallets could be fully automated via Node.js scripts:

1. **Preprod Faucet Anti-Bot Protections**:
   - The Midnight Preprod Faucet (`faucet.preprod.midnight.network`) utilizes Cloudflare Turnstile / bot protection and strict rate-limiting, preventing automated mass-drip requests from scripts.
2. **DUST Fee Sponsorship in Browser vs Headless**:
   - The Lace browser wallet extension includes native DUST fee sponsorship (`15,000 DUST Sponsored`) through an authenticated relay.
   - Headless CLI wallets lack access to this browser relay service and must wait for DUST to accrue naturally from registered NIGHT UTXOs over numerous blocks.
3. **Audit Integrity**:
   - Faking off-chain SHA-256 hashes would fail on-chain block explorer inspection. Real, authentic manual user testing with Lace/1AM wallets guarantees that all transactions are genuine, verifiable on-chain, and backed by real user feedback.

---

*Scholarship Vault · Midnight Buildthon Level 5 Submission*
