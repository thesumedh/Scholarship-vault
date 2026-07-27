# Scholarship Vault

**Privacy-Preserving Scholarship Verification on the Midnight Network**

[![CI](https://github.com/thesumedh/Scholarship-vault/actions/workflows/ci.yaml/badge.svg)](https://github.com/thesumedh/Scholarship-vault/actions/workflows/ci.yaml)
[![Frontend Build](https://github.com/thesumedh/Scholarship-vault/actions/workflows/frontend.yml/badge.svg)](https://github.com/thesumedh/Scholarship-vault/actions/workflows/frontend.yml)
[![Midnight Network](https://img.shields.io/badge/Network-Midnight_Preprod-7c3aed?style=flat-square)](https://midnight.network)
[![Language](https://img.shields.io/badge/Contract-Compact-a78bfa?style=flat-square)](https://midnight.network)
[![License](https://img.shields.io/badge/License-Apache_2.0-blue?style=flat-square)](./LICENSE)
[![X Follow](https://img.shields.io/badge/X-@thesumedh__-000?style=flat-square&logo=x)](https://x.com/thesumedh_)

> Built for the **Midnight Buildthon** · by [@thesumedh](https://github.com/thesumedh)

---

## Submission Checklist

### 🌔 Level 4

| Item | Status | Link |
|------|--------|------|
| Public GitHub repository | ✅ | [thesumedh/Scholarship-vault](https://github.com/thesumedh/Scholarship-vault) |
| Live Preprod demo | ✅ | [scholar-shield-ten.vercel.app](https://scholar-shield-ten.vercel.app/) |
| Contract address (Preprod) | ✅ | [`d13aabcf...3287e`](https://preprod.midnightexplorer.com/contracts/d13aabcf0599f9453f42637207303fb22ea0ed1f1bc8d34b56fe0f338da3287e) |
| CI/CD pipeline (passing) | ✅ | [GitHub Actions](https://github.com/thesumedh/Scholarship-vault/actions) |
| Product X profile | ✅ | [x.com/thesumedh_](https://x.com/thesumedh_) |
| Launch tweet | ✅ | [View post](https://x.com/thesumedh_/status/2081776021905543689) |
| Demo video | ✅ | [Watch on Google Drive](https://drive.google.com/file/d/1YUe91VBOKsM_-cpF4jBO_dhbyJyNmcWX/view?usp=sharing) |
| Minimum 15 meaningful commits | ✅ | [Commit history](https://github.com/thesumedh/Scholarship-vault/commits/main) |

### 🌕 Level 5

| Item | Status | Link |
|------|--------|------|
| Public GitHub repository (updated docs) | ✅ | [thesumedh/Scholarship-vault](https://github.com/thesumedh/Scholarship-vault) |
| Live demo link | ✅ | [scholar-shield-ten.vercel.app](https://scholar-shield-ten.vercel.app/) |
| 50 Preprod user wallet addresses | ✅ | [USERS.md](./USERS.md) |
| Feedback documentation | ✅ | [FEEDBACK.md](./FEEDBACK.md) |
| Demo video | ✅ | [Watch on Google Drive](https://drive.google.com/file/d/1YUe91VBOKsM_-cpF4jBO_dhbyJyNmcWX/view?usp=sharing) |
| Minimum 20 meaningful commits | ✅ | [Commit history](https://github.com/thesumedh/Scholarship-vault/commits/main) |

---

## What is Scholarship Vault?

Scholarship Vault is a Zero-Knowledge dApp on the **Midnight Network** that lets students prove they meet scholarship eligibility criteria — minimum GPA and maximum family income — **without ever revealing the actual numbers**.

Your data never leaves your browser. Only a cryptographic proof goes on-chain.

---

## Live Links

- **Frontend (Vercel):** https://scholar-shield-ten.vercel.app/
- **Contract (Midnight Preprod):** [`d13aabcf0599f9453f42637207303fb22ea0ed1f1bc8d34b56fe0f338da3287e`](https://preprod.midnightexplorer.com/contracts/d13aabcf0599f9453f42637207303fb22ea0ed1f1bc8d34b56fe0f338da3287e)
- **Demo Video:** [Google Drive](https://drive.google.com/file/d/1YUe91VBOKsM_-cpF4jBO_dhbyJyNmcWX/view?usp=sharing)
- **X (Twitter):** [x.com/thesumedh_](https://x.com/thesumedh_)
- **Launch Tweet:** [x.com/thesumedh_/status/2081776021905543689](https://x.com/thesumedh_/status/2081776021905543689)
- **50 Onboarded Users:** [USERS.md](./USERS.md)
- **Feedback Docs:** [FEEDBACK.md](./FEEDBACK.md)

---

## How It Works

```
Student Browser                    Midnight Preprod
─────────────────                  ────────────────
Enter GPA + Income  ──(local)──>  WASM ZK Circuit
                                        │
                                  Generate Proof
                                        │
                                  Submit Proof ──────>  Smart Contract
                                                              │
                                                       Verify on-chain
                                                              │
                                                    Mark address eligible
```

1. **Enter credentials locally** — GPA and income stay in your browser
2. **ZK proof generated** — WASM circuit proves you meet thresholds without exposing values
3. **Proof submitted** — Midnight contract verifies the math, marks your address eligible

**What's public:** thresholds, your address, proof validity  
**What's private:** your actual GPA, your actual income — forever

---

## Smart Contract

Written in **Compact** (`contracts/scholarship.compact`):

```compact
pragma language_version >=0.22.0;

export ledger min_gpa: Uint<32>;
export ledger max_income: Uint<32>;

constructor(initial_min_gpa: Uint<32>, initial_max_income: Uint<32>) {
    min_gpa = disclose(initial_min_gpa);
    max_income = disclose(initial_max_income);
}

export circuit verify_eligibility(gpa: Uint<32>, income: Uint<32>): [] {
    assert(gpa >= min_gpa, "GPA does not meet minimum requirement");
    assert(income <= max_income, "Income exceeds maximum threshold");
}
```

- `min_gpa` and `max_income` are **public ledger state** (disclosed by the admin)
- `gpa` and `income` are **private witnesses** — never disclosed, never on-chain

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Smart Contract | Compact (Midnight) |
| ZK Circuits | WASM / ZKIR |
| Frontend | React 19 + TypeScript + Vite |
| Wallet | 1AM / Lace (Midnight DApp Connector) |
| Styling | Custom CSS (purple/violet dark theme) |
| Testing | Vitest |
| CI/CD | GitHub Actions |
| Hosting | Vercel |

---

## Setup & Local Development

### Requirements

- Node.js v22+
- Yarn
- Docker Desktop (WSL2 on Windows)
- [1AM Wallet](https://1am.xyz) browser extension

### 1. Clone & Install

```bash
git clone https://github.com/thesumedh/Scholarship-vault.git
cd Scholarship-vault
yarn install
```

### 2. Compile the Contract

```bash
export PATH="$HOME/.local/bin:$PATH"
yarn compile
```

This populates `contracts/managed/scholarship/` with prover keys and TypeScript interfaces.

### 3. Run Tests Locally

```bash
yarn env:up                          # spin up local Midnight Docker network
npx vite-node scripts/wait-for-dust.ts
yarn test:local
yarn env:down                        # tear down when done
```

### 4. Run the Frontend

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`. Connect your 1AM wallet set to **Preprod** network.

### 5. Deploy a New Contract (Admin)

Navigate to `/admin` in the app and click **Deploy Contract to Preprod**. The deployed address will be saved to `localStorage` and displayed on screen.

---

## CI/CD

Two GitHub Actions workflows run on every push and PR to `main`:

| Workflow | What it does |
|----------|-------------|
| `ci.yaml` | Compiles contract → spins up local Midnight network → runs Vitest suite |
| `frontend.yml` | Installs deps → type-checks → builds the Vite frontend |

Badges at the top of this README reflect live status.

---

## Project Structure

```
Scholarship-vault/
├── contracts/
│   ├── scholarship.compact       # ZK smart contract (Compact)
│   └── managed/scholarship/      # Compiled artifacts (WASM, ZKIR, keys)
├── frontend/
│   ├── src/
│   │   ├── pages/                # LandingPage, VerifyPage, AdminPage, AboutPage
│   │   ├── components/           # NavBar, Footer, WalletBanner, PrivacyFlowViz
│   │   ├── contexts/             # WalletContext (1AM / Lace)
│   │   └── lib/midnight.ts       # Midnight.js session helpers
│   └── package.json
├── scripts/                      # deploy, balance, wait-for-dust helpers
├── src/test/                     # Vitest integration tests
├── .github/workflows/            # CI/CD pipelines
└── README.md
```

---

## Screenshots

### Landing Page
![UI Screenshot 1](./sub%20assets/ui1.png)

### Verify Page
![UI Screenshot 2](./sub%20assets/ui2.png)

### Admin Portal
![UI Screenshot 3](./sub%20assets/ui3.png)


### Contract Compilation
![Compile](./sub%20assets/yarn%20compile%20ss.png)

### Test Suite
![Tests](./sub%20assets/test%20output.png)

---

## Builder

Built by **Sumedh** — [@thesumedh](https://github.com/thesumedh) · [𝕏 @thesumedh_](https://x.com/thesumedh_)

---

## License

[Apache 2.0](./LICENSE)
