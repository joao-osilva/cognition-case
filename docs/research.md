# Research: What Microsoft Power Apps Does and Where Its Value Lies

## 1. What Power Apps Is

Microsoft Power Apps is a low-code application platform, part of the broader Power Platform
(Power Apps, Power Automate, Power BI, Power Pages, Copilot Studio). It provides a rapid
development environment for building custom business apps that connect to data in
Microsoft Dataverse or in 1,000+ external sources (SharePoint, SQL Server, Dynamics 365,
Salesforce, and so on).

Its core building blocks:

| Component | What it provides |
|---|---|
| **Canvas apps** | Drag-and-drop, pixel-level UI builder. "Start from the user experience" — forms, galleries, buttons wired to data with Excel-like formulas (Power Fx). |
| **Model-driven apps** | UI generated automatically from the data model. Define tables, relationships, forms, views, and business rules in Dataverse; the app (grids, detail forms, dashboards) is produced for you. This is the mode most relevant to CRUD-style internal tools. |
| **Microsoft Dataverse** | The managed data platform: relational tables, column-level security, business rules, server-side validation, and built-in change auditing. |
| **Connectors** | 1,000+ prebuilt connectors to Microsoft and third-party systems; custom connectors for internal REST APIs. |
| **Power Automate** | Workflow/automation engine — approvals, notifications, scheduled jobs — that pairs with apps. |
| **AI / Copilot** | Natural-language app generation and AI Builder models embedded into apps. |

## 2. The Capabilities That Matter for a Fintech Internal-Tools Team

Mapping Power Apps' value to the client's three apps (KYC review queue, refunds dashboard,
feature-flag admin panel), the capabilities doing the real work are:

1. **Data tables + views** — sortable, filterable, searchable grids over business records
   (KYC cases, refund requests, flags). This is the backbone of every internal tool.
2. **Forms with validation** — create/edit records with required fields, typed inputs,
   dropdowns, business-rule validation.
3. **Role-based access control** — Dataverse security roles + Microsoft Entra ID (Azure AD)
   integration. A KYC analyst can review; only a compliance lead can approve; only
   engineering can toggle a production flag. In a regulated fintech this is non-negotiable.
4. **Audit trail** — Dataverse auditing logs every create/update/delete and user access,
   with old value → new value history per record. For KYC and refunds this is a compliance
   requirement, not a nice-to-have.
5. **Workflow / approvals** — state machines (pending → approved/rejected) with
   notifications and escalation via Power Automate.
6. **Managed platform** — SSO, hosting, patching, backups, mobile responsiveness, and
   uptime are Microsoft's problem, not the team's.

Notably, the client's three apps use a small slice of the platform: they are all
"table + form + role-gated action + audit log" apps. They do not appear to use the
long-tail differentiators (200+ connectors, offline mobile, AI Builder, citizen
development at scale).

## 3. Where the Value Actually Lies

**Power Apps' real value proposition is not any single feature — it is:**

- **Speed to first version**: a working CRUD app in hours/days without engineers.
- **Citizen development**: non-engineers (ops, compliance) can build and modify apps.
- **Governance out of the box**: SSO, RBAC, auditing, and compliance certifications
  (SOC 2, ISO 27001, etc.) inherited from the Microsoft cloud.
- **Zero infrastructure ownership**: no servers, no deployments, no on-call.

**Its well-documented weaknesses** (relevant when evaluating a replacement):

- **Licensing cost and complexity**: Premium is ~$20/user/month list; premium connectors,
  Dataverse capacity, and per-app stacking make real-world costs hard to predict.
- **Delegation limits**: queries the connector can't delegate are evaluated client-side on
  a capped record set (500–2,000 rows) — results silently become wrong at scale.
- **Constrained data model & UX**: complex relational logic, custom UX, and anything
  beyond forms-over-data gets awkward fast.
- **API request limits**: per-user daily API caps tied to licensing.
- **Vendor lock-in**: apps, formulas (Power Fx), and data (Dataverse) are not portable.

## 4. The Hidden Costs of Replacing the Platform

The feature checklist above understates what "buy" actually purchases. Four costs are
easy to underestimate when proposing an in-house alternative:

1. **Auth is not trivial.** SSO, session management, role/permission models, and their
   ongoing maintenance (security patches, access reviews, offboarding) come integrated
   and off the shelf with Power Apps via Entra ID. Rebuilding this from scratch — and
   keeping it secure in a regulated fintech — is a significant, permanent engineering
   commitment, even with libraries like NextAuth/Auth.js or managed providers
   (Auth0, Clerk, WorkOS).
2. **Connectors are a product, not a feature.** Power Apps ships 1,000+ maintained
   connectors. An in-house platform would either hand-build and maintain each
   integration or adopt an integration layer (e.g. Composio, Merge, Paragon) — which
   reintroduces a vendor bill and still leaves glue code to own. If the client's tools
   need many third-party integrations, this alone is hard to justify rebuilding.
3. **Citizen development shifts TCO off the engineering team.** Non-technical users
   building/modifying their own apps — inside company-wide guardrails and limits set by
   admins — means internal tools don't queue behind product work. An in-house solution
   makes every new tool and every change an engineering ticket; that ongoing overhead is
   the largest hidden cost of "build".
4. **Demand forecast is the pivotal variable.** If these 3 apps are roughly it (or growth
   to ~10 similar CRUD apps), a simple internal solution maintained within the existing
   team's scope is plausible. If demand for new internal apps is likely to keep growing,
   the platform needs dedicated owners — and 1–3 FTEs at $200K+/year each quickly
   exceeds the current license cost, before opportunity cost is counted.
5. **"Build" still means buying (or hosting) the pieces.** Replicating Power Apps
   capabilities in-house almost inevitably pulls in other platforms — durable workflow
   engines (e.g. Temporal, Inngest), connector/integration platforms (e.g. Composio),
   managed authn/authz (e.g. Auth0, Clerk, WorkOS) — each with its own bill that must be
   counted against the license savings. The open-source route (self-hosted Temporal,
   Keycloak, n8n, etc.) trades those subscriptions for a larger cloud bill plus the
   engineering hours to stand the infrastructure up and keep it patched, monitored, and
   upgraded. Either way, "build" is never a zero-vendor, zero-infra option.

A complete assessment should also benchmark **alternative platforms** (Retool, Appsmith,
Budibase, ToolJet, etc.) whose pricing may align better with the client's scale and usage —
"replace the vendor" and "build in-house" are not the only two options; "switch to a
cheaper vendor" may dominate both.

## 5. The $250K/Year Question

At list price, 60 engineers × $20/user/month ≈ **$14.4K/year** — nowhere near $250K.
A $250K annual spend implies some combination of: organization-wide licensing (all
employees, not just engineers), Dataverse storage/capacity add-ons, premium connectors,
Power Automate licensing, managed environments, and/or an enterprise agreement bundling
consulting. Two implications:

1. The savings opportunity is real, but the first question to the client should be a
   license audit — they may be over-licensed for three internal apps regardless of
   build-vs-buy.
2. Any in-house alternative must be compared against the *renegotiated* Power Apps price
   (or a cheaper competitor like Retool at ~$10–50/user/month), not the current $250K.

## 6. What a Prototype Must Demonstrate

To credibly test "could we build this in-house with Devin?", the prototype should
replicate the capability core identified in §2, applied to the client's actual three apps:

- [ ] Data grid with filtering/search for each app (KYC queue, refunds, flags)
- [ ] Forms with validation for state-changing actions (approve/reject KYC, process
      refund, toggle/create flag)
- [ ] Role-based access control (viewer / approver / admin) gating those actions
- [ ] An audit log capturing who did what, when, with before/after values
- [ ] Deployed and shareable (Vercel), demonstrating the "zero-infra" story is achievable

Out of scope for a 2-hour prototype (and flagged honestly in the evaluation): real SSO
(Entra ID/Okta), a production database with backups, the connector ecosystem, citizen
development (non-engineers modifying apps), and compliance certification.

## Sources

- Microsoft, "What is Power Apps?" — learn.microsoft.com/power-apps/powerapps-overview
- Microsoft, Power Apps components (canvas, model-driven, Dataverse) — learn.microsoft.com/power-apps/maker
- Microsoft, Power Apps pricing — microsoft.com/power-platform/products/power-apps/pricing
- Microsoft, Power Platform Licensing Guide (Aug 2025)
- Microsoft, Dataverse auditing — learn.microsoft.com/power-platform/admin/manage-dataverse-auditing
- TechTarget, "Top Microsoft Power Apps limitations"
- Conduct, "Power Apps limitations: when to move off low-code"
