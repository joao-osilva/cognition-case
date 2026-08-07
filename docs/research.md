# Research: What Microsoft Power Apps Does and Where Its Value Lies

## 1. What Power Apps Is

A low-code app platform, part of Microsoft's Power Platform. Builds business apps on
top of Dataverse or 1,000+ external data sources.

| Component | What it provides |
|---|---|
| **Canvas apps** | Drag-and-drop UI builder with Excel-like formulas (Power Fx). |
| **Model-driven apps** | UI generated from the data model: define tables and rules, get grids, forms, and dashboards. The mode used for CRUD internal tools. |
| **Microsoft Dataverse** | Managed data platform: relational tables, column-level security, validation, change auditing. |
| **Connectors** | 1,000+ prebuilt integrations; custom connectors for internal APIs. |
| **Power Automate** | Workflows: approvals, notifications, scheduled jobs. |
| **AI / Copilot** | Natural-language app generation, AI Builder models. |

## 2. The Capabilities the Three Apps Use

1. **Data grids**: sortable, filterable views over KYC cases, refunds, flags.
2. **Validated forms**: required fields, typed inputs, business rules.
3. **RBAC**: analysts review, compliance leads approve, engineering toggles flags.
   Required in a regulated fintech.
4. **Audit trail**: every change logged with old and new values. Required for KYC
   and refunds.
5. **Approvals**: pending / approved / rejected state machines with notifications.
6. **Connectors**: integrations (identity providers, payment processors) the team
   does not maintain.
7. **Managed platform**: SSO, hosting, patching, backups are the vendor's problem.

Same pattern in all three apps: table, form, role-gated action, audit log. Offline
mobile, AI Builder, and the rest of the platform go unused.

## 3. Where the Value Lies

The value is the bundle, not any single feature:

- **Speed**: a working CRUD app in hours or days, without engineers.
- **Citizen development**: operations and compliance build their own apps.
- **Governance**: SSO, RBAC, auditing, SOC 2 / ISO 27001 inherited from Microsoft.
- **Maintained integrations**: connectors are configuration, not code to own.
- **No infrastructure**: no servers, deployments, or on-call.

The documented weaknesses:

- **Licensing**: ~$20/user/month list, but premium connectors, Dataverse capacity,
  and per-app stacking make real costs hard to predict.
- **Delegation limits**: non-delegable queries run client-side on 500 to 2,000 rows
  and return wrong results at scale.
- **Constrained UX**: hard to go beyond forms-over-data.
- **API caps**: per-user daily request limits.
- **Lock-in**: apps, Power Fx, and Dataverse data are not portable.

## 4. Caution: Price May Not Reflect Usage

Platform spend often reflects contract structure, not usage. At list price, 60 users
cost roughly $14.4K/year, far below the reported $250K. Start with a license audit.
Compare building against the renegotiated price or a cheaper competitor, not the
current contract.

## Sources

- Microsoft, "What is Power Apps?" - learn.microsoft.com/power-apps/powerapps-overview
- Microsoft, Power Apps components (canvas, model-driven, Dataverse) - learn.microsoft.com/power-apps/maker
- Microsoft, Power Apps pricing - microsoft.com/power-platform/products/power-apps/pricing
- Microsoft, Power Platform Licensing Guide (Aug 2025)
- Microsoft, Dataverse auditing - learn.microsoft.com/power-platform/admin/manage-dataverse-auditing
- TechTarget, "Top Microsoft Power Apps limitations"
- Conduct, "Power Apps limitations: when to move off low-code"
