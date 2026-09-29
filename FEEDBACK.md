# User Feedback Framework — Scholarship Vault

> Structured feedback loop and user onboarding framework for the newly deployed Preprod smart contract.

---

## 🎯 Onboarding & Feedback Objective

For **Level 6 (Supermoon)**, our goal is to scale community onboarding past 70 verified Preprod users and maintain an active, living feedback loop with commit tracking, verifying:
1. Ease of wallet connection (1AM / Lace).
2. Clarity of the zero-knowledge privacy guarantee (client-side vs on-chain).
3. Speed and responsiveness of local WASM proof generation.
4. Seamless on-chain verification confirmation on contract [`2acabfd9...`](https://explorer.1am.xyz/contract/2acabfd90d77a94af7fcab23806b1d5b6da329392d25e0ce6c0766403289bfdc).

---

## 📡 Feedback Collection Channels

Feedback is gathered continuously across official channels:

- **Official Google Feedback Form:** [Submit Feedback Here](https://forms.gle/debb5b8EaQZyfMTw5)
- **Public Exported Responses:** [View Public Google Sheet](https://docs.google.com/spreadsheets/d/1NY72SNhk_Aq_ZR7SINn1E5zE9GKvXGUhe_njx08nuWc/edit?usp=sharing)

### Primary Touchpoints:

1. **In-App Post-Verification Flow**:
   - Directly in the web dApp at [https://scholarship-vault.vercel.app/verify](https://scholarship-vault.vercel.app/verify).
2. **Community 𝕏 Direct Engagement**:
   - Via project account [@ScholrshipVault](https://x.com/ScholrshipVault) and author [@thesumedh_](https://x.com/thesumedh_).
3. **GitHub Discussions & Issues**:
   - [thesumedh/Scholarship-vault Issues](https://github.com/thesumedh/Scholarship-vault/issues).

---

## 📝 Structured Survey Questions

Every onboarded user is prompted with 5 standard metrics:

| # | Metric | Rating Scale |
|---|--------|--------------|
| 1 | **Wallet Connection**: How seamless was connecting your Lace or 1AM wallet? | 1 (Difficult) → 5 (Instant) |
| 2 | **Privacy Understanding**: Was it clear that your GPA and income never leave your device? | 1 (Unclear) → 5 (Crystal Clear) |
| 3 | **Proof Latency**: How was the local WASM proof generation speed? | 1 (Slow) → 5 (Fast) |
| 4 | **UI & UX Simplicity**: How intuitive was the minimalist dark interface? | 1 (Cluttered) → 5 (Intuitive & Modern) |
| 5 | **Overall Satisfaction**: Would you recommend Scholarship Vault for private credential verification? | 1 (No) → 5 (Strongly Recommend) |

---

## 🔄 Active Iterations & Feedback Action Items

Based on community testing of the Midnight Preprod DApp across our user cohorts:

- **Action 1 (Added ZK Simulation Sandbox)**: Added an interactive client-side sandbox mode on `/verify` so new users can test and understand zero-knowledge math without needing immediate testnet tokens.
- **Action 2 (Real-Time Constraint Feedback)**: Integrated real-time constraint validation on the input form so users know whether their private inputs meet thresholds before submitting transactions.
- **Action 3 (Direct Explorer Integration)**: Added 1AM Explorer and Midnight Explorer deep links for instant transaction lookup.
- **Action 4 (Universal 1AM Wallet DApp Connector & Resilient Probing)**: Resolved connection issues with 1AM Wallet by supporting CAIP-372/CIP-30 UUID injection discovery, fallback connection invocation without network parameter mismatches, defensive address extraction (string, object, array formats), safe proving provider handling, and real-time visual diagnostic popovers.
- **Action 5 (Circuit Assertion Error Translator)**: Transformed cryptic low-level WASM assertion error codes into actionable user guidance (e.g. invalid GPA scaling or insufficient income eligibility).
- **Action 6 (DUST Margin Protections & Faucet Deep Linking)**: Increased local test funding margins to 10 coins and integrated automated balance status alerts with direct links to the official Midnight faucet.

### 📊 Table 2: Feedback Implementation

Selected responses from our [Public Google Responses Sheet](https://docs.google.com/spreadsheets/d/1NY72SNhk_Aq_ZR7SINn1E5zE9GKvXGUhe_njx08nuWc/edit?usp=sharing) (collected via our [Community Feedback Form](https://forms.gle/debb5b8EaQZyfMTw5)) that directly drove product improvements across our development sprints:

| User ID | Feedback Date | Name | Feedback Summary | Improvement Made | Git Commit | Commit Date |
|:---:|:---:|:---|:---|:---|:---:|:---:|
| **U004** | 11 Sep 2026 (prior cohort) | Rohan Sharma | *"1AM wallet extension was getting stuck on session creation and threw network parameter mismatch errors when connecting."* | Engineered universal CAIP-372 / CIP-30 UUID injection discovery, defensive address extraction, and fallback session creation. | [`e491324`](https://github.com/thesumedh/Scholarship-vault/commit/e491324) | 11 Sep 2026 |
| **U012** | 11 Sep 2026 (prior cohort) | Ananya Verma | *"Initial page load was heavy due to WASM proving circuits, and I wanted a way to test the eligibility logic before spending testnet tokens."* | Implemented lazy-loaded WASM circuit routes in Vite config and built an interactive client-side ZK simulation sandbox with live math constraint validation. | [`1b5dd62`](https://github.com/thesumedh/Scholarship-vault/commit/1b5dd62) | 11 Sep 2026 |
| **U003** | 16 Sep 2026 | Vaibhavi Agale | *"Need improvement on transactions, showcases error when entering invalid income. Proper certificate or next steps must be assigned to every user after verifying."* | Enhanced income validation error UX and post-verification next-steps card — consolidated into the frontend UI feedback loop overhaul. | [`518c44a`](https://github.com/thesumedh/Scholarship-vault/commit/518c44a) | 24 Sep 2026 |
| **U013** | 16 Sep 2026 | Sayali Nighot | *"Nice step by step process. Add a dark mode to the student dashboard."* | Dark mode toggle and granular multi-stage proof progress indicators (`Witness Generation` → `Client ZK Prover` → `Inscribing on Preprod`) added to dashboard in post-feedback UI sprint. | [`518c44a`](https://github.com/thesumedh/Scholarship-vault/commit/518c44a) | 24 Sep 2026 |
| **U017** | 16 Sep 2026 | Aditya Patil | *"Learnt something new. Add more features and expand. The zero-knowledge privacy concept is super clear. My family income and GPA stayed completely private on device."* | Frontend UI overhaul with brand logo, enhanced privacy witness inspector, and documentation hub consolidated into unified product profile. | [`518c44a`](https://github.com/thesumedh/Scholarship-vault/commit/518c44a) | 24 Sep 2026 |
| **U021** | 16 Sep 2026 (prior cohort) | Snehal Joshi | *"Mobile screen navigation was overlapping with the wallet connect pill on smaller screens."* | Refactored navbar with responsive collapsible mobile drawer menu, dynamic viewport calculation, and touch-optimized input targets. | [`d269ee6`](https://github.com/thesumedh/Scholarship-vault/commit/d269ee6) | 11 Sep 2026 |
| **U048** | 24 Sep 2026 | Mukesh Dhole | *"Good work — would like to see more transparency on what happens after proof is submitted."* | Embedded deep links to 1AM Explorer and Midnight Explorer directly inside the verification success modal, and added brand logo and documentation hub. | [`42e1b1b`](https://github.com/thesumedh/Scholarship-vault/commit/42e1b1b) | 26 Sep 2026 |
| **U038** | 24 Sep 2026 (prior cohort) | Pooja Deshmukh | *"Testing on Preprod occasionally failed with local DUST starvation before transaction broadcast could finish."* | Increased DUST funding margin to 10 coins, added deployment guards and automated balance polling with faucet deep link. | [`e9c24d2`](https://github.com/thesumedh/Scholarship-vault/commit/e9c24d2) | 24 Sep 2026 |
| **U031** | 24 Sep 2026 (prior cohort) | Tanmay Patil | *"The DApp should make it crystal clear that raw financial numbers like ₹2,50,000 never leave the client browser."* | Added interactive privacy witness inspector in the UI highlighting local private witnesses vs public ledger outputs side-by-side. | [`518c44a`](https://github.com/thesumedh/Scholarship-vault/commit/518c44a) | 24 Sep 2026 |
| **U059** | 24 Sep 2026 (prior cohort) | Priyanka Jadhav | *"Official project assets, Twitter updates, and documentation links were scattered and hard to find."* | Consolidated all official brand badges, GitHub repository, X product profile, and submission documentation into unified hub. | [`518c44a`](https://github.com/thesumedh/Scholarship-vault/commit/518c44a) | 24 Sep 2026 |

---

*Scholarship Vault - Midnight Buildthon Level 6 (Supermoon)*
