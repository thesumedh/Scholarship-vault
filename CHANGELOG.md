# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-07-13

### Added
- Full MVP live on Midnight Preprod network
- Rebrand to **Scholarship Vault** with purple/violet dark theme
- Gradient hero headline and radial glow background on landing page
- Split-color `Scholar`**Shield** logo in NavBar
- Footer with builder credits: [@thesumedh](https://github.com/thesumedh) · [𝕏 @thesumedh_](https://x.com/thesumedh_)
- `frontend.yml` GitHub Actions workflow — type-check + Vite build on every push
- Submission checklist table in README
- Full setup, usage, and architecture documentation in README
- CI/CD badge for both `ci.yaml` and `frontend.yml` in README

### Changed
- CSS theme: replaced brutalist cyber-green (`#00ff66`) with modern purple/violet (`#a78bfa`)
- Navbar background: glassmorphism (`backdrop-filter: blur`) instead of flat surface
- Buttons: gradient fill with glow shadow instead of flat solid color
- Border radii: rounded (`6–16px`) throughout instead of sharp `0px` edges
- Hero section: added `::before` radial gradient glow pseudo-element
- Feature cards: hover lift (`translateY(-2px)`) + accent border on hover
- How-it-works steps: numbered `STEP 01/02/03` labels with icon boxes
- AboutPage: icon box header, GitHub + Twitter action buttons, Buildthon credit
- Footer: full grid layout with app links, resources, network status, and builder credit

## [0.4.0] - 2025-07-10

### Added
- `AdminPage`: one-click contract deployment to Midnight Preprod via wallet
- Deployed contract address auto-saved to `localStorage` after deploy
- `PrivacyFlowViz` component: animated step-by-step privacy flow visualization on VerifyPage
- Explorer link on eligible/ineligible result — links to `preprod.midnightexplorer.com`

### Changed
- VerifyPage: GPA input now accepts 0.0–10.0 range with 0.01 step
- VerifyPage: income input labeled in INR (₹) with 1000-step increments
- WalletBanner: shows wallet type (1AM / Lace) and truncated address when connected

## [0.3.0] - 2025-07-07

### Added
- GitHub Actions `ci.yaml`: compile contract → start local Midnight Docker → run Vitest → teardown
- GitHub Actions `scan.yaml`: daily SARIF security scan via `midnightntwrk/upload-sarif-github-action`
- Vitest integration test suite (`src/test/scholarship.test.ts`) covering eligible and ineligible paths
- `scripts/wait-for-dust.ts`: polls local network until test wallet has sufficient DUST
- `dependabot.yml`: automated dependency update PRs for npm and GitHub Actions

### Fixed
- Contract compilation now correctly populates `contracts/managed/scholarship/` with ZKIR artifacts
- `yarn env:up` / `yarn env:down` scripts added to `package.json` for Docker lifecycle management

## [0.2.0] - 2025-07-04

### Added
- React + TypeScript + Vite frontend scaffold (`frontend/`)
- `WalletContext`: polls for 1AM / Lace wallet injection, exposes `connect` / `disconnect`
- `WalletBanner` component: connect button, connected state with address pill
- `NavBar` with active-route highlighting and wallet banner integration
- `LandingPage`: hero, stats, features grid, how-it-works steps, CTA
- `VerifyPage`: GPA + income form, ZK proof generation, on-chain submission, result display
- `AboutPage`: problem statement, ZK solution explanation, open-source links
- `Footer`: brand, app links, resources, network status columns
- `lib/midnight.ts`: `createConnectedSession` helper wrapping Midnight.js providers
- `config.ts`: `PREPROD_CONTRACT_ADDRESS`, `MIN_GPA_THRESHOLD`, `MAX_INCOME_THRESHOLD` constants
- Vercel deployment config (`vercel.json`) with SPA rewrite rules
- `.env.example` for local environment variable setup

### Changed
- `index.css`: full custom design system — dark theme, accent colors, card/button/form/result styles

## [0.1.0] - 2025-07-01

### Added
- `scholarship.compact`: Compact ZK smart contract with `verify_eligibility` circuit
- Constructor initializes `min_gpa` and `max_income` as public ledger state via `disclose()`
- `verify_eligibility` circuit asserts GPA ≥ threshold and income ≤ threshold using private witnesses
- `contracts/index.ts`: TypeScript contract bindings
- `scripts/deploy.ts`: CLI deployment script for Preprod
- `scripts/balance.ts`: wallet balance checker
- `scripts/address.ts`: wallet address printer
- `compose.yml`: Docker Compose for local Midnight network (indexer, proof-server, node)
- `compile.sh`: shell script wrapping `compact` compiler invocation
- Root `package.json` with `compile`, `test:local`, `env:up`, `env:down` scripts
- `tsconfig.json`, `vitest.config.ts` project configuration
- `LICENSE` (Apache 2.0), `CODE_OF_CONDUCT.md`, `CONTRIBUTING.md`, `SECURITY.md`
- Issue templates: bug report, feature request, documentation improvement
- Pull request template
- `PROJECT_SPEC.md`: full architectural specification and privacy model
