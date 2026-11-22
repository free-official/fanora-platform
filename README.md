# FANORA — Global Social & Creator Monetization Platform

FANORA is being built as a global platform where creators can develop a profile, connect with their audience, and eventually monetize memberships, digital products, paid interactions, and live experiences.

## Current repository
- Responsive public landing page: `index.html`
- Design system and responsive layout: `styles.css`
- Lightweight interactions: `app.js`
- Product roadmap and delivery boundaries: `docs/PRODUCT-ROADMAP.md`
- GitHub Pages deployment workflow: `.github/workflows/deploy.yml`

## Preview locally
Open `index.html` in a modern browser. The current early-access form is intentionally a demo; it does not submit or store email addresses.

## Deploy
The workflow deploys the repository root to GitHub Pages on every push to `main`. In repository Settings → Pages, set the build and deployment source to **GitHub Actions** if it is not already selected. Then inspect the Actions run and its deployment URL.

## Not production-ready yet
This is the public website foundation, not the complete creator platform. Authentication, database, media storage, moderation, payments, creator payouts, and production policies are not implemented. Those components need provider selection, secrets, security controls, and end-to-end testing before launch.

Never commit API keys or other secrets.
