# User Feedback Framework — Scholarship Vault

> Structured feedback loop and user onboarding framework for the newly deployed Preprod smart contract.

---

## 🎯 Onboarding & Feedback Objective

For **Level 6 (Supermoon)**, our goal is to guide Preprod users through the Zero-Knowledge scholarship verification pipeline on Midnight Preprod, verifying:
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

Based on early community testing of the Midnight Preprod DApp:

- **Action 1 (Added ZK Simulation Sandbox)**: Added an interactive client-side sandbox mode on `/verify` so new users can test and understand zero-knowledge math without needing immediate testnet tokens.
- **Action 2 (Real-Time Constraint Feedback)**: Integrated real-time constraint validation on the input form so users know whether their private inputs meet thresholds before submitting transactions.
- **Action 3 (Direct Explorer Integration)**: Added 1AM Explorer deep links for instant transaction lookup.
- **Action 4 (Universal 1AM Wallet DApp Connector & Resilient Probing)**: Resolved connection issues with 1AM Wallet by supporting CAIP-372/CIP-30 UUID injection discovery, fallback connection invocation without network parameter mismatches, defensive address extraction (string, object, array formats), safe proving provider handling, and real-time visual diagnostic popovers.



### 📊 Table 2: Feedback Implementation

Selected responses from the Google Form sheet that directly drove product improvements in this iteration:

| User ID | Name | Feedback Summary | Improvement Made | Git Commit |
|:---:|:---|:---|:---|:---:|
| **U003** | Vaibhavi Agale | *"Need improvement on transactions, showcases error, proper certificate must be assigned to every user"* | Enforced strict `min=0` numeric income validation, added user-friendly error translator converting raw circuit assertion codes to actionable messages, and generated post-verification eligibility cards. | [`f73cd49`](https://github.com/thesumedh/Scholarship-vault/commit/f73cd49) |
| **U013** | Sayali Nighot | *"Nice step by step process. Please add a dark mode to the student dashboard."* | Built dedicated Dark Mode toggle on student dashboard with theme state persistence via localStorage and multi-stage progress indicators (`Witness Generation` → `Client ZK Prover` → `Inscribing on Preprod`). | [`b097153`](https://github.com/thesumedh/Scholarship-vault/commit/b097153) |
| **U004** | Rohan Sharma | *"1AM wallet extension was getting stuck on session creation and threw network parameter mismatch errors when connecting."* | Engineered universal CAIP-372 / CIP-30 UUID injection discovery, defensive address extraction, and fallback session creation. | [`e491324`](https://github.com/thesumedh/Scholarship-vault/commit/e491324) |
| **U012** | Ananya Verma | *"Initial page load was heavy due to WASM proving circuits, and I wanted a way to test the eligibility logic before spending testnet tokens."* | Implemented lazy-loaded WASM circuit routes in Vite config and built an interactive client-side ZK simulation sandbox with live math constraint validation. | [`1b5dd62`](https://github.com/thesumedh/Scholarship-vault/commit/1b5dd62) |

---

*Scholarship Vault - Midnight Buildthon Level 6*
