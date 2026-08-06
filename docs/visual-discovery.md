# Visual Discovery: What Power Apps Looks Like (and how our prototype could resemble it)

Goal: make the prototype visually comparable to the client's existing Power Apps experience, so their build-vs-buy assessment compares apples to apples on UX/UI.

Sources: Microsoft Learn — "Basic navigation in a model-driven app", "Modern, refreshed look for model-driven apps" (Fluent design, mandatory as of 2026 Wave 1), "App navigation", "Command designer overview".

## 1. The anatomy of a model-driven Power App (what users see daily)

The client's 3 apps (KYC queue, refunds, flags) are almost certainly model-driven apps — the standard shell looks like this:

### App shell
- **Top app header bar** — colored band (default purple/customizable) with waffle icon, app name, global search, settings, and user avatar on the right.
- **Left navigation pane (sitemap)** — collapsible vertical rail: `Home`, `Recent ⌄`, `Pinned ⌄` at top, then **group labels** with table sub-areas beneath (e.g. group "Asset Checkout" → Products / Reservations / Reviews). Active item shows a colored left edge indicator. An **area switcher** sits at the bottom when the app has multiple areas.

### List views (the "grid" pages — equivalent of our KYC/refunds/flags tables)
- **Command bar** at top of the content area: `← Back`, `Show Chart`, `+ New`, `Delete`, `Refresh`, `Email a Link`, `Flow ⌄` — flat text+icon buttons, not filled buttons.
- **View selector** below the command bar: bold title with dropdown chevron, e.g. "Active Products ⌄" — lets users switch saved views/queries.
- **Grid**: leftmost **checkbox column** for multi-select; **primary column rendered as a blue link** (opens the record); **per-column header dropdowns** for sort/filter; a "Search this view" box at top-right; **jump bar** (A–Z) and paging footer ("1–8 of 8, Page 1").
- Modern (2026 Wave 1) look: Fluent styling, infinite scrolling grid, optional inline editing, floating command bar.

### Record/form pages (equivalent of our KYC review dialog)
- Full-page (not a modal): **command bar** (`Save`, `Save & Close`, `+ New`, `Deactivate`, `Assign`, `Refresh`…) on top.
- **Record header**: record name + a few key read-only columns on the right (e.g. revenue, # employees), plus status.
- **Tabs** under the record name (`Summary` / `Details` / `Related`).
- Body: **multi-column field sections** with left-aligned labels and light-gray filled inputs (Fluent), required-field asterisks, lookups rendered as blue link chips. Often a **timeline/activities panel** in the middle column and related-records panel on the right.

## 2. Where our current prototype diverges

| Power Apps | Our prototype today |
|---|---|
| Left sitemap nav + colored top app bar | Single top nav bar only |
| Command bar (flat icon+text actions) above grids | Filled shadcn buttons inline per-row |
| View selector ("Active Cases ⌄") | Select-based status filter |
| Checkbox multi-select column, primary column = blue link | No selection; "Review" button per row |
| Full-page record form with tabs + record header | Modal dialog for KYC review |
| A–Z jump bar + paging footer | No paging (small dataset) |
| Fluent visuals: gray filled inputs, left labels | shadcn defaults, stacked labels |

## 3. Proposal — "Power Apps look" without abandoning our stack

Keep Next.js + shadcn + the Slate/Indigo tokens, but restructure the shell and grid chrome to mirror the model-driven UX:

1. **App shell**: add a slim colored top app bar (app name, search, avatar) + a collapsible left sitemap ("Internal Tools" group → KYC Queue / Refunds / Feature Flags; "Governance" group → Audit Log; "Assessment" group → Research / Evaluation / Recommendation), with active-item left indicator. Role switcher moves to the top bar.
2. **List pages**: replace inline filled buttons with a **command bar row** (flat ghost buttons: New, Refresh, actions enabled by selection) + a **view selector** ("Pending cases ⌄" replacing the status Select) + a checkbox selection column + primary column as link.
3. **KYC record page**: optionally convert the dialog into a full-page record view with record header + tabs (Summary / Audit history) — the biggest single fidelity win.
4. Keep our palette (or optionally offer a "Power Apps purple" theme toggle for a true side-by-side feel).

Suggested scope for a first pass: items 1 + 2 (shell + grid chrome), leaving 3 as a follow-up if wanted.
