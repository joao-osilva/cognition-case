# cognition-case

Build-vs-buy assessment for a Series C fintech (~60 engineers) currently paying
$250K/year for Microsoft Power Apps to run three internal apps: a KYC review queue,
a refunds dashboard, and a feature-flag admin panel.

This repo contains both the **working prototype** (a ~2-hour Devin build replicating
the Power Apps capability core: data grids, validated forms, role-based access,
audit trail) and the **written assessment** (research, evaluation, recommendation),
delivered as a single Next.js app.

**Live deployment:** https://cognition-case.vercel.app

## What the prototype does

- **KYC Review Queue** (`/apps/kyc`): pending identity checks in a selectable grid;
  full-page case records with approve / reject / escalate decisions. Rejections and
  escalations require a note.
- **Refunds Dashboard** (`/apps/refunds`): open exposure summary, batch approve /
  reject with confirmation, payout processing. Refunds over 1,000 and payouts
  require the admin role.
- **Feature-Flag Admin** (`/apps/flags`): per-environment toggles and rollout
  percentages; all changes are admin-only.
- **Audit Log** (`/audit`): every state-changing action across the three apps,
  with actor, role, and before/after values. Authorization is enforced server-side
  in the API routes, not just hidden in the UI.
- **Assessment** (`/analysis/research`, `/analysis/evaluation`,
  `/analysis/recommendation`): the written analysis, rendered from `docs/`.

The shell deliberately mirrors Power Apps model-driven UX (top app bar, sitemap
navigation, command bars, view selectors) so the client can compare the prototype
against their existing platform like for like. The app also ships dark mode and
three locales (English, Brazilian Portuguese, Spanish).

## Running locally

```bash
npm install
npm run dev
```

Open http://localhost:3000. Use the role switcher in the top bar to demo
role-based access as viewer / approver / admin. Theme and language switchers are
next to it.

Other commands: `npm run build`, `npm run lint`.

## Structure

- `src/app/[locale]/apps/{kyc,refunds,flags}` — the three prototype apps
- `src/app/[locale]/audit` — cross-app audit log
- `src/app/[locale]/analysis/[slug]` — renders the assessment docs
- `src/app/api/` — API routes with server-side role enforcement
- `src/lib/` — in-memory data store, seed data, types
- `docs/` — research.md, evaluation.md, recommendation.md, architecture.md
  (with `pt-BR/` and `es/` translations of the client-facing docs)
- `messages/` — UI message catalogs (en, pt-BR, es)

## Notes

- Data is seeded in memory and reseeds on cold starts, a deliberate prototype
  scope cut discussed in the evaluation.
- Stack: Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS 4,
  shadcn/ui, next-intl, next-themes. Deployed on Vercel.
- `docs/architecture.md` is a one-page overview of the design and its tradeoffs.
