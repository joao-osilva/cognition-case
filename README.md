# cognition-case

Build-vs-buy assessment for a Series C fintech (~60 engineers) currently paying
$250K/year for Microsoft Power Apps to run three internal apps: a KYC review queue,
a refunds dashboard, and a feature-flag admin panel.

This repo contains both the **working prototype** (a ~2-hour Devin build replicating
the Power Apps capability core: data grids, validated forms, RBAC, audit trail) and
the **written assessment** (research, evaluation, recommendation), delivered as a
single Next.js app.

## Structure

- `src/app/apps/kyc` — KYC review queue
- `src/app/apps/refunds` — refunds dashboard
- `src/app/apps/flags` — feature-flag admin panel
- `src/app/audit` — cross-app audit log
- `src/app/analysis/[slug]` — renders the assessment docs
- `docs/` — research.md, evaluation.md, recommendation.md (markdown sources)

## Running locally

```bash
npm install
npm run dev
```

Open http://localhost:3000. Use the role switcher (top-right) to demo RBAC as
viewer / approver / admin.

## Notes

- Data is seeded in-memory and reseeds on cold starts — a deliberate prototype
  scope cut, discussed in the evaluation.
- Deployed on Vercel.
