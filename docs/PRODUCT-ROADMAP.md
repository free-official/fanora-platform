# FANORA product roadmap

## Product direction
FANORA is a global creator platform for profiles, community, memberships, digital products, paid interactions, and live experiences.

## Phase 1 — Public MVP foundation
- Responsive public website and brand system.
- Product positioning and creator feature overview.
- GitHub Actions deployment workflow for GitHub Pages.
- Accessibility basics and mobile navigation.

## Phase 2 — Authenticated product
- Creator and supporter accounts.
- Secure authentication, email verification, password reset, and role-based access.
- Creator profiles, posts, media library, and community feed.
- Admin moderation and abuse-reporting workflows.

## Phase 3 — Monetization
- Membership tiers and recurring billing.
- Digital product catalog, checkout, and protected delivery.
- Paid interactions and event tickets.
- Creator earnings ledger, refunds, disputes, and payout reconciliation.

## Phase 4 — Launch readiness
- Privacy policy, terms, community guidelines, and data retention policy.
- Security review, rate limiting, audit logs, backups, and monitoring.
- Accessibility, performance, localization, and mobile QA.

## Important implementation constraints
- No payment processing or payout flow is active in this repository yet.
- The current email-interest form is a front-end demonstration and does not collect or transmit addresses.
- Production authentication, database, storage, payment provider, and email delivery require selected providers and securely configured credentials.
- Do not commit API keys, passwords, signing keys, or private credentials.
- Before enabling payments, confirm the supported countries, provider eligibility, legal obligations, tax treatment, refunds, and payout rules.

## Current release status
The public landing page and Pages workflow are the first code deliverables. A successful GitHub Actions deployment and public URL must be verified separately before calling the site live.
