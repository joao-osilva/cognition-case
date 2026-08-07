# Evaluation

## 1. Context

The prototype was built in roughly two hours with Devin. Goal: replicate the
capability core the three apps use on the platform (grids, validated forms, RBAC,
audit trail), not a production system. It is deployed on Vercel and shareable.

## 2. What Was Replicated, What Was Not, and the Gap

Replicated:

- Data grids with filtering and search (KYC queue, refunds, flags)
- Validated forms for state-changing actions
- RBAC (viewer, approver, admin), enforced server-side
- Audit log: who did what, when, with before and after values
- Deployed and shareable

Not replicated, and what bridging each gap would take:

| Gap | What it takes |
|---|---|
| **Real SSO** | Managed provider (Auth0, Clerk, WorkOS). Days to integrate, permanent dependency. |
| **Persistent database** | Postgres plus migrations, backups, retention. Days to set up, ongoing operations. |
| **Connectors** | Hand-built integrations or an integration layer (Composio, Merge, Paragon). The hardest gap: ongoing work either way. |
| **Citizen development** | Not bridgeable. Every new tool and every change becomes an engineering ticket. |
| **Compliance certification** | Inherited from infrastructure choices; months of audit work if certification is required. |

## 3. Evaluation Dimensions

**Build cost.** Engineering hours first: hardening the prototype into a production
system (SSO, database, integrations, testing) is weeks of senior time, not hours.
And building still means buying: workflow engines (Temporal, Inngest), managed auth,
integration layers each have a bill. Self-hosting the open-source equivalents
(Temporal, Keycloak, n8n) trades subscriptions for cloud spend. There is no
zero-vendor option.

**Maintenance burden.** Connectors are a product, not a feature; someone must keep
every integration working as third-party APIs change. Self-hosted infrastructure adds
patching, upgrades, and on-call.

**Security implications.** Authentication and authorization are a permanent
commitment. Authentication (SSO, sessions, MFA) and authorization (role models,
permission checks on every action) come with the platform today and would become the
team's responsibility. In a regulated fintech, so do audit and compliance obligations.

**Opportunity cost.** Citizen development disappears: operations and compliance stop
building their own apps and file tickets instead. Demand forecast decides the scale:
at three to ten CRUD apps the current team absorbs it; beyond that, one to three
dedicated engineers at $200K+ exceed the license cost before opportunity cost is
counted.

## 4. Capex vs. Opex

How the dimensions land as one-time versus recurring cost:

| Dimension | Capex (one-time) | Opex (recurring) |
|---|---|---|
| **Build cost** | Initial build: weeks of senior engineering to harden the prototype | Tool subscriptions or cloud spend for self-hosted equivalents |
| **Maintenance burden** | - | Integration upkeep, patching, upgrades, on-call |
| **Security** | SSO and authorization integration | Access reviews, dependency patching, audit and compliance work |
| **Opportunity cost** | Features not shipped during the initial build | Every tool change as an engineering ticket; 1 to 3 dedicated engineers ($200K+ each) if demand grows |

Buying inverts the profile: near-zero capex, a single opex line (the license), and the
vendor carries maintenance and security.
