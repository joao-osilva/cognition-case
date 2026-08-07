# Research: What Microsoft Power Apps Does and Where Its Value Lies

## 1. What Power Apps Is

Microsoft Power Apps is a low-code application platform within the Power Platform
(Power Apps, Power Automate, Power BI, Power Pages, Copilot Studio). It provides a rapid
development environment for business apps that connect to data in Microsoft Dataverse
or in 1,000+ external sources (SharePoint, SQL Server, Dynamics 365, Salesforce, and others).

Its core building blocks:

| Component | What it provides |
|---|---|
| **Canvas apps** | Drag-and-drop UI builder: forms, galleries, and buttons wired to data with Excel-like formulas (Power Fx). |
| **Model-driven apps** | UI generated from the data model. Define tables, relationships, forms, views, and business rules in Dataverse; the app (grids, detail forms, dashboards) is produced automatically. This is the mode most relevant to CRUD-style internal tools. |
| **Microsoft Dataverse** | The managed data platform: relational tables, column-level security, business rules, server-side validation, and built-in change auditing. |
| **Connectors** | 1,000+ prebuilt connectors to Microsoft and third-party systems; custom connectors for internal REST APIs. |
| **Power Automate** | Workflow and automation engine (approvals, notifications, scheduled jobs) that pairs with apps. |
| **AI / Copilot** | Natural-language app generation and AI Builder models embedded into apps. |

## 2. The Capabilities That Matter for the Engineering Team

The three apps (KYC review queue, refunds dashboard, feature-flag admin panel) rely on
a specific subset of the platform:

1. **Data tables and views**: sortable, filterable, searchable grids over business
   records (KYC cases, refund requests, flags).
2. **Forms with validation**: create and edit records with required fields, typed
   inputs, and business-rule validation.
3. **Role-based access control**: Dataverse security roles integrated with Microsoft
   Entra ID. An analyst can review, only a compliance lead can approve, only
   engineering can toggle a production flag. In a regulated fintech this is a
   requirement.
4. **Audit trail**: Dataverse auditing logs every create, update, and delete with old
   and new values per record. For KYC and refunds this is a compliance requirement.
5. **Workflow and approvals**: state machines (pending to approved or rejected) with
   notifications and escalation via Power Automate.
6. **Connectors**: internal tools rarely stand alone. A KYC queue reads from identity
   verification providers, a refunds dashboard talks to payment processors, and a flag
   panel may notify chat or ticketing systems. The maintained connector catalog, plus
   custom connectors for internal APIs, is what keeps those integrations off the
   engineering team's plate.
7. **Managed platform**: SSO, hosting, patching, backups, and uptime are the vendor's
   responsibility.

All three apps follow the same core pattern: table, form, role-gated action, audit log,
with integrations at the edges. They do not appear to use the platform's remaining
differentiators such as offline mobile or AI Builder.

## 3. Where the Value Lies

The platform's value is the bundle rather than any single feature:

- **Speed to first version**: a working CRUD app in hours or days, without engineers.
- **Citizen development**: non-engineers (operations, compliance) can build and modify apps.
- **Governance out of the box**: SSO, RBAC, auditing, and compliance certifications
  (SOC 2, ISO 27001) inherited from the Microsoft cloud.
- **A maintained integration ecosystem**: 1,000+ connectors that the vendor keeps
  working as third-party APIs change, so integrations are configuration rather than
  code the team owns.
- **Zero infrastructure ownership**: no servers, deployments, or on-call.

Its documented weaknesses, relevant when evaluating a replacement:

- **Licensing cost and complexity**: Premium is roughly $20/user/month at list price;
  premium connectors, Dataverse capacity, and per-app stacking make real costs hard
  to predict.
- **Delegation limits**: queries a connector cannot delegate are evaluated client-side
  on a capped record set (500 to 2,000 rows), which produces incorrect results at scale.
- **Constrained data model and UX**: complex relational logic and custom UX beyond
  forms-over-data are difficult.
- **API request limits**: per-user daily API caps tied to licensing.
- **Vendor lock-in**: apps, Power Fx formulas, and Dataverse data are not portable.

## 4. A Caution on the Current Spend: Price May Not Reflect Usage

A useful check before any build-vs-buy comparison: what a team pays for a platform
today often reflects how the contract was structured, not how the platform is used.
Low-code licensing typically mixes per-user seats, capacity add-ons, premium
connectors, automation licensing, managed environments, and enterprise agreements that
bundle consulting. Three apps' worth of usage can sit inside a contract priced for far
more.

For reference, at Power Apps list price, 60 engineers at $20/user/month is roughly
$14.4K/year, an order of magnitude below the reported $250K spend. Whatever the
platform, two implications follow:

1. The first step should be a license and usage audit. The team may be paying for
   capacity, seats, or bundled services it does not use, regardless of the
   build-vs-buy decision.
2. Any in-house alternative must be compared against the renegotiated platform price,
   or against a cheaper competitor at $10 to $50/user/month, not against the current
   contract.

## Sources

- Microsoft, "What is Power Apps?" - learn.microsoft.com/power-apps/powerapps-overview
- Microsoft, Power Apps components (canvas, model-driven, Dataverse) - learn.microsoft.com/power-apps/maker
- Microsoft, Power Apps pricing - microsoft.com/power-platform/products/power-apps/pricing
- Microsoft, Power Platform Licensing Guide (Aug 2025)
- Microsoft, Dataverse auditing - learn.microsoft.com/power-platform/admin/manage-dataverse-auditing
- TechTarget, "Top Microsoft Power Apps limitations"
- Conduct, "Power Apps limitations: when to move off low-code"
