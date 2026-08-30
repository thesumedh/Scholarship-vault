# User Feedback Framework — Scholarship Vault

> Structured feedback loop and user onboarding framework for the newly deployed Preprod smart contract.

---

## 🎯 Onboarding & Feedback Objective

For **Level 5 (Full Moon)**, our goal is to guide Preprod users through the Zero-Knowledge scholarship verification pipeline on Midnight Preprod, verifying:
1. Ease of wallet connection (1AM / Lace).
2. Clarity of the zero-knowledge privacy guarantee (client-side vs on-chain).
3. Speed and responsiveness of local WASM proof generation.
4. Seamless on-chain verification confirmation on contract [`2acabfd9...`](https://explorer.1am.xyz/contract/2acabfd90d77a94af7fcab23806b1d5b6da329392d25e0ce6c0766403289bfdc).

---

## 📡 Feedback Collection Channels

Feedback is gathered continuously across 3 primary touchpoints:

1. **In-App Post-Verification Flow**:
   - Directly in the web dApp at [https://scholar-shield-ten.vercel.app/verify](https://scholar-shield-ten.vercel.app/verify).
2. **Community 𝕏 Direct Engagement**:
   - Via author profile [@thesumedh_](https://x.com/thesumedh_).
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

---

*Scholarship Vault · Midnight Buildthon Level 5*
