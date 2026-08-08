# Recommendation

**Renegotiate or replace the contract first. Build only if that fails, or when demand
for internal tools outgrows three apps.**

## 1. Situation

The engineering team pays $250K/year for a platform running three CRUD apps. At list
price, 60 users cost roughly $14.4K/year. The prototype proves the capability core is
replicable in hours. The real cost of building is ownership: SSO, database, connector
upkeep, compliance, and the loss of citizen development.

## 2. The Options

| Option | Annual cost | Engineering effort | Risk | Customization |
|---|---|---|---|---|
| Renegotiate the contract | Good: list price is ~$14.4K; even 3x that is far below today | Good: none | Good: nothing changes operationally | Poor: constraints stay |
| Move to a cheaper vendor (Retool, Appsmith, Budibase) | Good: $20-40K/year range for this size | Fair: weeks of migration for three small apps | Fair: new lock-in, better exit terms | Fair: more flexible, still a platform |
| Build in-house | Fair: tool subscriptions now; $200K+ per dedicated engineer if demand grows | Poor: weeks of hardening, then permanent upkeep | Fair: security and compliance become the team's problem | Good: full control |

## 3. Reasoning

- Commodity test: internal CRUD tools do not differentiate the business. Commodity
  capability defaults to buy.
- Honest TCO: build estimates for internal tooling overrun 2.5 to 3x. Compare
  three-year build cost against the corrected license price, not the current contract.
  Build only wins against the inflated number.
- There is no pure build: auth, database, and integration layers would still be
  bought. The real choice is which vendor set to own.
- Citizen development is lost: today operations and compliance ship their own
  changes; in-house, every change is an engineering ticket.
- Where Devin fits: the prototype took two hours, and the follow-on work is the same
  shape of well-scoped task. Building gets cheaper, but the ownership costs remain.

## 4. What Would Change the Call

- The audit fails: spend cannot be brought near list price.
- Demand grows: a roadmap of ten or more internal tools makes dedicated ownership
  worth it.
- Customization becomes a real constraint: delegation limits or UX ceilings block the
  workflows.
- Compliance requires data control the vendor cannot provide.

## 5. Next Steps

1. License and usage audit: one week, finance plus one engineer.
2. Quotes from two competitor platforms, same week.
3. Decision checkpoint: renegotiated total under roughly $50K/year means buy, and the
   question closes for a year.
4. Otherwise, a four-week build pilot with Devin: production-harden the KYC app end to
   end, including SSO and persistence, and re-measure the cost line before committing
   to the other two.
