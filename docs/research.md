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

## 2. The Capabilities That Matter for This Client

The client's three apps (KYC review queue, refunds dashboard, feature-flag admin panel)
rely on a specific subset of the platform:

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
6. **Managed platform**: SSO, hosting, patching, backups, and uptime are Microsoft's
   responsibility.

The three apps use a small slice of the platform. All of them follow the same pattern:
table, form, role-gated action, audit log. They do not appear to use the long-tail
differentiators such as the connector catalog, offline mobile, or AI Builder.

## 3. Where the Value Lies

Power Apps' value is the bundle rather than any single feature:

- **Speed to first version**: a working CRUD app in hours or days, without engineers.
- **Citizen development**: non-engineers (operations, compliance) can build and modify apps.
- **Governance out of the box**: SSO, RBAC, auditing, and compliance certifications
  (SOC 2, ISO 27001) inherited from the Microsoft cloud.
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

## 4. The Hidden Costs of Replacing the Platform

Five costs are easy to underestimate when proposing an in-house alternative:

1. **Authentication and authorization are a permanent engineering commitment.** SSO,
   session management, and role models come integrated with Power Apps via Entra ID.
   Rebuilding and maintaining them securely in a regulated fintech is significant
   ongoing work, even with managed providers (Auth0, Clerk, WorkOS) or libraries.
2. **Connectors are a product, not a feature.** An in-house platform would either
   hand-build and maintain each integration or adopt an integration layer (Composio,
   Merge, Paragon), which reintroduces a vendor bill and still leaves glue code to own.
3. **Citizen development shifts cost off the engineering team.** With Power Apps,
   non-technical users build and modify their own apps within admin-set guardrails.
   An in-house solution turns every new tool and every change into an engineering
   ticket. This ongoing overhead is the largest hidden cost of building.
4. **Demand forecast is the pivotal variable.** If demand stays at roughly these three
   apps, or grows to around ten similar CRUD apps, a simple internal solution
   maintained within the existing team's scope is plausible. If demand keeps growing,
   the platform needs dedicated owners, and one to three engineers at $200K+ per year
   quickly exceeds the current license cost before opportunity cost is counted.
5. **Building still means buying or hosting the pieces.** Replicating the platform's
   capabilities pulls in workflow engines (Temporal, Inngest), integration platforms,
   and managed auth, each with its own bill. The open-source route (self-hosted
   Temporal, Keycloak, n8n) trades those subscriptions for a larger cloud bill plus
   the engineering hours to run, patch, and upgrade the infrastructure. Building is
   never a zero-vendor, zero-infrastructure option.

A complete assessment should also benchmark alternative platforms (Retool, Appsmith,
Budibase, ToolJet) whose pricing may fit the client's scale better. Replacing the
vendor and building in-house are not the only options; switching to a cheaper vendor
may dominate both.

## 5. Interpreting the $250K Annual Spend

At list price, 60 engineers at $20/user/month is roughly $14.4K/year, far below $250K.
A $250K spend implies some combination of organization-wide licensing, Dataverse
capacity add-ons, premium connectors, Power Automate licensing, managed environments,
or an enterprise agreement bundling consulting. Two implications:

1. The first question to the client should be a license audit. They may be
   over-licensed for three internal apps regardless of the build-vs-buy decision.
2. Any in-house alternative must be compared against the renegotiated Power Apps
   price, or a cheaper competitor at $10 to $50/user/month, not against the current
   $250K.

## 6. What a Prototype Must Demonstrate

To test whether the team could build this in-house with Devin, the prototype should
replicate the capability core from section 2, applied to the client's three apps:

- [ ] Data grid with filtering and search for each app (KYC queue, refunds, flags)
- [ ] Forms with validation for state-changing actions (approve or reject KYC,
      process refund, toggle or create flag)
- [ ] Role-based access control (viewer, approver, admin) gating those actions
- [ ] An audit log capturing who did what, when, with before and after values
- [ ] Deployed and shareable (Vercel)

Out of scope for a two-hour prototype, and flagged in the evaluation: real SSO,
a production database with backups, the connector ecosystem, citizen development,
and compliance certification.

## Sources

- Microsoft, "What is Power Apps?" - learn.microsoft.com/power-apps/powerapps-overview
- Microsoft, Power Apps components (canvas, model-driven, Dataverse) - learn.microsoft.com/power-apps/maker
- Microsoft, Power Apps pricing - microsoft.com/power-platform/products/power-apps/pricing
- Microsoft, Power Platform Licensing Guide (Aug 2025)
- Microsoft, Dataverse auditing - learn.microsoft.com/power-platform/admin/manage-dataverse-auditing
- TechTarget, "Top Microsoft Power Apps limitations"
- Conduct, "Power Apps limitations: when to move off low-code"
