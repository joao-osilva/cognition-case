# Evaluation

_The full evaluation (what the prototype replicated, what it could not, and what
closing the gap would require in build cost, maintenance burden, security implications,
and opportunity cost) is being written in the next phase of the assessment. Two parts
are already in place: the criteria the prototype was built against, and the hidden
costs any replacement must price in._

## What the Prototype Set Out to Demonstrate

To test whether the team could build this in-house with Devin, the prototype replicates
the capability core identified in the research, applied to the three apps:

- [x] Data grid with filtering and search for each app (KYC queue, refunds, flags)
- [x] Forms with validation for state-changing actions (approve or reject KYC,
      process refund, toggle or create flag)
- [x] Role-based access control (viewer, approver, admin) gating those actions,
      enforced server-side
- [x] An audit log capturing who did what, when, with before and after values
- [x] Deployed and shareable (Vercel)

Out of scope for a two-hour prototype: real SSO, a production database with backups,
the connector ecosystem, citizen development, and compliance certification. These
exclusions are deliberate and are priced out below and in the recommendation.

## The Hidden Costs of Replacing the Platform

Five costs are easy to underestimate when proposing an in-house alternative:

1. **Authentication and authorization are a permanent engineering commitment.** SSO,
   session management, and role models come integrated with the platform via Entra ID.
   Rebuilding and maintaining them securely in a regulated fintech is significant
   ongoing work, even with managed providers (Auth0, Clerk, WorkOS) or libraries.
2. **Connectors are a product, not a feature.** An in-house platform would either
   hand-build and maintain each integration or adopt an integration layer (Composio,
   Merge, Paragon), which reintroduces a vendor bill and still leaves glue code to own.
3. **Citizen development shifts cost off the engineering team.** With the platform,
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
Budibase, ToolJet) whose pricing may fit the team's scale better. Replacing the vendor
and building in-house are not the only options; switching to a cheaper vendor may
dominate both.
