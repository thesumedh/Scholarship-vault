# Project Spec: ScholarShield | Privacy-Preserving Scholarship Verification on Midnight

## 1. Overview
A decentralized application (dApp) that allows students to prove their eligibility for scholarships (based on GPA, income, category, and age) without revealing their raw personal data or certificates. It utilizes Midnight's zero-knowledge proofs to check that credentials issued by trusted authorities satisfy scholarship rules.

---

## 2. Core Architecture

### Components
```
   [ Issuer Portal ] ──(Issues Signed Credential)──> [ Student Wallet ]
                                                            │
                                                     (Generates ZK Proof)
                                                            │
                                                            ▼
[ Scholarship Board ] <──(Verifies proof on-chain)── [ Compact Contract ]
```

1. **Issuer Portal (Frontend/Client)**:
   - Simulates trusted authorities (University, Tax Department, Government).
   - Cryptographically signs structured credentials (e.g., GPA, Income, Caste category) using the issuer's private key.
2. **Student Wallet (Frontend/Client)**:
   - Holds issued credentials in private local storage.
   - Selects a scholarship to apply for, fetches its requirements, and inputs the credentials to generate a zero-knowledge proof.
3. **Compact Contract (Smart Contract)**:
   - Defines the public rules of the scholarship (stored in ledger).
   - Exposes a verification circuit that validates the ZK proof (verifies issuer signature and compares GPA/Income requirements) without revealing the credentials on the public ledger.
4. **Scholarship Board Portal (Frontend)**:
   - Displays applications with a binary verification status (`Eligible` or `Not Eligible`).
   - Disburses scholarships to verifiably eligible addresses.

---

## 3. Privacy Model

| Data Point | What is Public (Ledger) | What is Private (Witness) |
| :--- | :--- | :--- |
| **Student Identity** | None (unless linked to payout address) | Full identity details |
| **GPA** | Only that `GPA >= threshold` | Exact GPA (e.g., `9.13`) |
| **Family Income** | Only that `Income <= threshold` | Exact income (e.g., `₹1,80,000`) |
| **Category** | Only that it is on the allowed list | Exact category |
| **Issuer Authority** | Public key of the trusted issuer | None (must be known to verify signature) |
| **Verification State**| Proof validity (`true`/`false`) | Intermediate computation variables |

---

## 4. Implementation Roadmap

- **Phase 1 (Level 1)**: Set up WSL2/Docker, install `compact` compiler. Write the `.compact` contract, compile circuits, write test suite, and deploy to Preview/Preprod.
- **Phase 2 (Level 2)**: Wire the compiled smart contract APIs to a React/Vite frontend. Integrate Lace Wallet connection.
- **Phase 3 (Level 3)**: Polishing the UX, adding comprehensive integration tests, and configuring CI/CD pipelines.
