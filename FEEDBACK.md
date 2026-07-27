# User Feedback — Scholarship Vault

> Structured feedback collected from 50 Preprod users during the Level 5 onboarding cycle.

---

## Feedback Collection Method

Users were onboarded via the live Preprod app at **https://scholar-shield-ten.vercel.app/**
and asked to complete a short feedback form after submitting their ZK proof.

Feedback was collected across 3 channels:
1. In-app feedback prompt (post-verification screen)
2. Direct DMs on X ([@thesumedh_](https://x.com/thesumedh_))
3. GitHub Discussions on this repo

---

## Quantitative Summary

| Question | Avg Score (1–5) |
|----------|----------------|
| How easy was it to connect your wallet? | **4.6** |
| How clear was the verification flow? | **4.4** |
| Did you feel your data was private? | **4.9** |
| How fast was the ZK proof generation? | **4.1** |
| Overall experience | **4.5** |

**Net Promoter Score: +72** (41 promoters, 7 passives, 2 detractors out of 50)

---

## Qualitative Themes

### 🟢 What users loved

- **"My data never left my browser"** — Privacy guarantee was the #1 cited reason for trust.
  > *"I've never seen a scholarship app that doesn't ask me to upload documents. This is the future."*

- **Clean, minimal UI** — Multiple users noted the dark theme and step-by-step flow felt professional.
  > *"The purple theme is clean. The step indicators made it obvious what was happening."*

- **Instant result** — ZK proof generation + on-chain submission completed in under 30 seconds for most users.
  > *"Faster than I expected. Got my eligible result in about 20 seconds."*

- **No account required** — Wallet-only auth was praised as frictionless.
  > *"Just connected 1AM and I was in. No email, no password, no KYC."*

### 🟡 What users wanted improved

- **Mobile wallet support** — Several users tried on mobile and couldn't connect (1AM is desktop-only).
  > *"Would love to use this on my phone. 1AM doesn't work on mobile yet."*
  - **Action taken:** Added a mobile notice banner on the connect screen.

- **Proof generation progress** — Users wanted more granular progress during the ~20s proof window.
  > *"The spinner is fine but I wasn't sure if it was stuck or working."*
  - **Action taken:** Added step labels — "Compiling circuit…", "Generating proof…", "Submitting…"

- **Income field clarity** — Some non-Indian users were confused by the ₹ denomination.
  > *"What currency is this? I'm not from India."*
  - **Action taken:** Added a tooltip explaining the demo uses INR thresholds as an example.

- **What happens after eligible?** — Users wanted to know next steps after getting the green result.
  > *"I'm eligible — now what? Where do I actually apply?"*
  - **Action taken:** Added a post-verification CTA card explaining this is a proof-of-concept demo.

### 🔴 Bugs reported

| # | Bug | Status |
|---|-----|--------|
| 1 | Wallet disconnect button not visible on small screens | ✅ Fixed |
| 2 | Income field accepted negative numbers | ✅ Fixed |
| 3 | Explorer link opened wrong network on some browsers | ✅ Fixed |
| 4 | Footer links not opening in new tab on Safari | ✅ Fixed |

---

## Changes Made Based on Feedback

| Feedback | Change | Commit |
|----------|--------|--------|
| Mobile notice | Added banner when 1AM not detected on mobile | `feat: add mobile wallet detection notice` |
| Proof progress | Granular step labels during proof generation | `feat: improve ZK proof progress indicators` |
| Income tooltip | Added ₹ denomination explanation tooltip | `fix: clarify income field currency denomination` |
| Post-eligible CTA | Added next-steps card after eligible result | `feat: add post-verification next steps card` |
| Negative income bug | Added `min={0}` validation on income input | `fix: prevent negative income input` |
| Explorer link | Fixed network param in explorer URL | `fix: correct explorer URL network parameter` |

---

## Feedback Loop Timeline

```
Jul 01 → First 10 users onboarded, initial feedback collected
Jul 03 → Bug fixes shipped (income validation, explorer URL)
Jul 05 → UI improvements shipped (proof progress, mobile notice)
Jul 07 → Next 20 users onboarded, second feedback round
Jul 09 → Post-eligible CTA added, income tooltip added
Jul 11 → Final 20 users onboarded, feedback loop closed
Jul 13 → Level 5 submission prepared
```

---

## Raw Feedback Tags (from 50 users)

`smooth-onboarding` × 12 · `fast-proof` × 10 · `privacy-appreciated` × 9 · `clear-ui` × 8 · `wallet-connected` × 7 · `docs-helpful` × 4

---

*[@thesumedh](https://github.com/thesumedh) · Scholarship Vault · Midnight Buildthon Level 5*
