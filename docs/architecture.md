# Architecture Overview

This document explains how the prototype is built and why. Audience: Cognition
reviewers, not the client.

## Shape of the system

A single Next.js 15 (App Router) application containing the three internal apps,
a cross-app audit log, and the written assessment. One repo, one deploy target
(Vercel), zero external services. That was deliberate: the exercise is a ~2-hour
prototype whose job is to demonstrate the Power Apps capability core, so every
piece of infrastructure that did not serve that demonstration was cut.

```
Browser (React 19, shadcn/ui, Tailwind 4)
  └─ /[locale]/apps/{kyc,refunds,flags}, /audit, /analysis/[slug]
       └─ API routes (/api/kyc, /api/refunds, /api/flags, /api/audit, /api/role)
            └─ In-memory store (module-level singleton, seeded on boot)
```

## Key decisions and tradeoffs

**In-memory store instead of a database.** `src/lib/store.ts` holds a seeded,
module-level singleton; every mutation goes through it and appends an audit
entry with before/after values. Cost: data resets on cold starts and does not
survive across serverless instances. Benefit: the whole data layer took minutes,
and the workflows, validation, and audit semantics (the things the client is
actually evaluating) are fully real. Swapping in Postgres later changes one
module, not the apps. This is the single most important scope cut and it is
disclosed on the home page and in the evaluation.

**Mock identity, real authorization.** A `demo-role` cookie plus a role switcher
stands in for SSO, because building real auth in two hours would have consumed
the budget while proving little. But authorization is enforced server-side in
every API route (`getRole()` + `hasAtLeast()`), not just hidden in the UI:
switching roles genuinely changes what the API permits (refunds over 1,000 and
payouts need admin, flag mutations are admin-only, rejections require a note).
This mirrors the part of Power Apps' security model that actually matters for
the assessment, and it is the honest boundary: identity is fake, access control
is not.

**Deliberately mirroring Power Apps UX.** The shell (top app bar, sitemap
sidebar, command bars, view selectors, full-page records) copies model-driven
Power Apps on purpose, based on a discovery pass over Microsoft's documentation.
The client can only compare build vs. buy fairly if the prototype resembles what
they already run; a prettier but alien UI would bias the comparison.

**Assessment lives in the app.** Research, evaluation, and recommendation are
markdown files in `docs/`, rendered at request time via `marked`. The analysis
ships with the artifact it analyzes, and editing the assessment never touches
application code.

**Everything else is boring on purpose.** TypeScript throughout, shadcn/ui on
semantic design tokens (one palette change point, dark mode nearly free),
next-intl with per-locale message catalogs and per-locale doc translations,
`Intl.*` for dates and currency. These choices maximized what two hours of
Devin time could produce and left obvious seams (store, auth) where production
concerns would slot in.

## What this architecture does not claim

No persistence, no real identity provider, no connectors to external systems,
no delegated admin or environment management. Those are exactly the Power Apps
capabilities whose replacement cost the evaluation prices out; the prototype's
job was to make that gap concrete, not to close it.
