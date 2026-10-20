# optionsdata.ai: canonical product definition

Owner/decision authority: jbt. Revision: **2026-10-13.1**. Created at jbt's request to align landing and platform work.
Canonical home: `convexvalue/cv-hq`, `docs/optionsdata-ai/product.md`. Edit the original here, not a repo snapshot.

## Authority and use

This file defines product direction, the status of candidate capabilities, and permitted public claims.
Platform `docs/design.md` defines technical architecture; `docs/schema.md` is the draft field contract;
`docs/implementation.md` defines engineering build order. Neither a feature idea, a schema field, nor merged code
constitutes a launch commitment. The [parameter inventory](https://github.com/convexvalue/cv-hq/blob/main/docs/optionsdata-ai/platform-parameters-2026-10-09.md) records evidence.

Before a landing, guide, pitch, platform-scope or public-schema task:
1. Read this document and the relevant technical source. The orchestrator supplies this file in
   `run/context/optionsdata-product.md`, recording the cv-hq commit and revision in the brief.
2. Product repos keep a readable snapshot at `docs/product-definition.md`, with provenance in
   `docs/product-context.md`, and link it from AGENTS.md and README.md. Snapshots are not independent authorities.
3. On a relevant decision change, update this original first, refresh both repo snapshots and open-task context,
   and notify the affected task through its brief/next dispatch feedback. A running task's old context does not
   become current merely because a file was copied; review it against the new revision before collection/merge.
4. Review public claims and scope against the pinned revision. Record implementation evidence separately from
   approval and customer availability. Unresolved differences go to jbt; never silently choose a release scope.

This adds alignment, not a new deployment/merge permission. Product-repo instruction changes still follow PR review.
Do not copy secrets, private leads, unrelated ledger files or credentials into task context.

## Approved direction and current public promise

- Brand/category: **Options data for AI agents.**
- Approved explanation: **“We’re building a US options data API and MCP server for AI assistants and the software
  you build with them.”**
- Two uses: ask an assistant questions about the options market; build software that uses options data with a
  coding agent. API/MCP is product direction, not an assertion of current access.
- Immediate landing objective: introduce the brand and collect email addresses for **“Get launch updates.”**
  This is not a reservation, access entitlement, paid commitment or price-qualified waitlist.
- Optional checkbox: **“Business or professional use.”** Interest signal only; not a verified OPRA subscriber
  classification or separate sales-email consent.
- Visual direction (jbt, 2026-10-10: "use this style: https://alphai.io/, be concise, direct"): adopt alphai.io's
  editorial style: charcoal background, off-white ink, one restrained green accent, Geist Sans headings with
  Geist Mono labels, hairline rules, generous whitespace, a large two-line headline, no decorative illustration.
  This supersedes the ConvexValue near-black/green treatment and its chain/Time and Sales illustrations on the
  homepage. On 2026-10-11 jbt requested dark mode: this supersedes the light palette only; keep the editorial
  layout, typography and restraint. Use the same dark palette on shared guide/privacy/methodology pages.
  Keep a plain optionsdata.ai wordmark, the approved sentence, the signup form and the
  ADOM/contact/Privacy footer.
- Homepage scope (jbt, 2026-10-10, revision .3): no pricing, no date, no availability claim; the homepage carries the
  category headline, the approved offer block below and the launch-update form. jbt's reasoning: the audience has
  been sold vague terms before; we differentiate by stating precisely what the service returns and where each
  value comes from. Approved copy, verbatim (jbt: "approved, ship it"):

  > Real-time OPRA data, via API, MCP and WebSocket.
  > Built for AI agents: query it from your assistant, build on it with your coding agent.
  > — Every US equity and index option (OPRA)
  > — Quotes: bid, ask, size, update time (OPRA NBBO)
  > — Trades: last, size, time, and the full time-and-sales log with corrections and cancels (OPRA)
  > — IV and Greeks: implied volatility, delta, gamma, theta, vega, rho, recomputed every second, method published (in-house)
  > — Open interest: daily, dated (OPRA). Volume: counted from the prints (in-house)

  (Revision 2026-10-11.1: jbt chose the second lead line above, "Built for AI agents: query it from your assistant,
  build on it with your coding agent.", over his draft "Designed from the ground up for AI agents: query the data from
  your chatbot, and build apps with your agents." The public methodology page must not name the feed vendor; it names
  OPRA and the licence only.)
  (Revision .4: jbt removed the seventh line, "A value we can't compute says why. Nothing stale shown as current.",
  as awkward; the behaviour it described stays in the methodology.) "method published" links to the methodology page.
  No eyebrow above the headline; no "Operated by ADOM Inc." line in the footer (the privacy page still names the
  operator). The two guides, the privacy page and the methodology page are linked from the footer.
  **What the block commits us to is documented in one place:** the public methodology page, served at
  optionsdata.ai/methodology from the landing repo and kept canonically in platform `docs/methodology.md`; the
  platform's `docs/implementation.md` "Public commitments" table turns each line into a requirement with its test
  (time to settlement to the second with no floor, `calc_time` and quality flags on every derived record on every
  surface, exchange and receive times on every quote and print, `incomplete` on gapped volume, our own volume count
  reconciled with the vendor's, a `method` version bumped with this page). The service is not sold until they pass.
- Homepage composition (jbt approved 2026-10-13): use one vertical narrative with a broad centered desktop
  headline, the two approved explanatory sentences immediately below it, then compact signup. The form
  must not stretch across the desktop page. This supersedes the earlier forced two-line desktop headline.
  Keep charcoal/off-white, restrained mint primary action, consistent frame, fewer rules and tight mobile rhythm.
  Follow signup with a secondary **“Explore with sample data”** section, clearly distinct from launch updates
  and live access. **“Copy setup prompt”** is the action; the complete selectable prompt lives in an accessible
  **“View prompt”** disclosure, with a secondary demo link. Synthetic data labeling stays attached. Staging
  must state when its setup/demo is unavailable; this design decision does not activate a staging backend.
  Present existing coverage explanations beneath short labels: Coverage, Quotes, Trades, IV & Greeks,
  Open interest & volume. Reorganizing the approved text and adding those labels is authorized; its field,
  source, timing and methodology commitments do not change. Group footer links by purpose.
- No additional founder biography or ConvexValue brand story approved. Preserve the original signup's recorded
  eligibility/permissions; removing the new discount does not erase existing commitments.

Source: [founder interview](https://github.com/convexvalue/cv-hq/blob/main/docs/optionsdata-ai/redesign-interview-2026-10-09.md), [live release](https://github.com/convexvalue/cv-hq/blob/main/docs/optionsdata-ai/brand-intro-release-2026-10-09.md),
[ADR 0009 amendment](https://github.com/convexvalue/cv-hq/blob/main/docs/adr/0009-optionsdata-one-offer-campaign.md).

## Onboarding direction — selected by jbt, 2026-10-12

Design for eventual self-service registration, initially admit invited users through the same experience, and
open registration when a new user can complete a useful journey without founder assistance. Minimize required
steps and time from landing to the first useful result; preserve the chosen goal through sign-in and onboarding.

The first useful result differs by user. jbt identified three paths:
- Ask a question through MCP and get an answer grounded in the supplied data.
- Create an artifact/visual in ChatGPT or Claude from the data.
- Go directly to code and build with the data.

A short intent choice may guide the flow and provide product-learning information. Implementation direction:
make the choice optional, allow it to change, reuse a goal already expressed in a prompt/link, and avoid asking
again in the chatbot. This is a product preference, never OPRA classification, approved use or an entitlement.
Collect only the selected category for this purpose; do not collect chat transcripts or code by default.

jbt accepted comparing near-the-money SPX options across the next two expirations (prices, IV and an explanation)
as one valid first-answer example, not the sole first experience. Demo data is approved for onboarding. Keep
sample provenance, date/scenario and demo labeling attached to answers, artifacts and code outputs; never imply
it is current market data. Default initial prototype source is explicit synthetic fixtures. Production recordings
are not automatically approved for anonymous redistribution by this demo decision. Live access retains its own
eligibility, grants and service-readiness requirements; a demo never creates a live entitlement.

Sign-in direction: Google and email. Exact email authentication mechanism and production provider configuration
remain engineering work, including verification/recovery. No email campaign or customer migration is implied.

Founder concept: copy a getting-started prompt from the landing page into a chatbot, then let the assistant guide
setup and the selected first result. Connector installation/authorization and actual assistant interoperability
must be tested; a URL in a prompt does not establish an installed MCP connection. Keep a direct website guide
available. The first real MCP/data integration is distinct from the already tested identity-provider spike.

These decisions authorize design/implementation direction. The current live landing promise/intake stays as
recorded above until a tested onboarding experience is released. No universal one-click promise, new commercial
bundle, public signup activation, price, free live-data trial or launch date is established by this section.

## Commercial principle — selected by jbt, 2026-10-10

The paid product must earn purchases and renewals through the useful capabilities it delivers at the time of
sale. Establish a simple, honest offering and find the people it benefits. Future features, potential use cases
and the roadmap must not be needed to justify its price or retain customers. The prelaunch page may describe
the selected planned scope; that is not evidence of a deliverable paid product.

Prioritize doing a few necessary things well over adding breadth. Founder-provided customer examples:
Paige needs affordable real-time bid/ask; Mark needs IV/Greeks using actual remaining time to the correct
expiration/settlement instant for near-close 0DTE analysis. These are concrete needs, not measured evidence of
our service's quality or a general claim about every competitor's calculation method.

Hosted recurring workflows and options-tool endpoints (straddles, simulations, payoff calculations, backtesters)
are not the basis of the initial sales proposition. Live fields, Time and Sales and simple real-time scanners are
offer candidates; scanner scope, WebSocket access, history and price remain under discussion. Existing Phase I
selection below remains the approved bundle. Any additional inclusion requires a product decision and working
customer-facing evidence before sale. Do not sell future additions as part of the subscription's value.

## Commercial Phase I — selected by jbt, 2026-10-09

**Data coverage: all US equity and index options (OPRA).**

**Selected data:** bid, ask, last, open interest, volume, Greeks, implied volatility, and Time and Sales.
Greeks refer to the existing delta/gamma/theta/vega/rho family; final field names, units and methods remain subject
to schema review. OI is daily/as-of data. Time and Sales means individual trade records; historical depth and
retention have not been selected. This selects the commercial feature bundle, not a release date or declaration
that serving infrastructure is complete. API and MCP remain the delivery direction.

Landing instruction (superseded for the homepage by revision 2026-10-10.2; retained as the record of T-0111/T-0112):
show this planned coverage and scope, with an options-chain visual containing those fields
and a Time and Sales log. Visuals must be legible, modern and restrained, using explicitly illustrative values.
No fake live feed, implied trading execution, or claim that these illustrative views are a shipped terminal.
Useful interactions may switch sample calls/puts or explain fields. Preserve launch-update signup and consent.
This supersedes the prior typography-only/no-feature-list restriction for the homepage. T-0111 deployed the
first phase I visuals with approval; the subsequent ConvexValue-inspired redesign is T-0112 and requires its
own deployment approval. Restrained illustration motion is allowed, with reduced-motion/static fallbacks and
clear illustrative labels; do not represent simulated events as a live feed.

## Capability register

“Engineering planned” means the platform design includes it, not that commercial phase 1 includes it.
“Implemented” below means library/prototype/replay code, **not a public, licensed, supported service**.
Evidence baseline: platform main `8d9248d32399892ef4826e4fd3a6d4dd168bb2a7`, roadmap and T-0108 on 2026-10-09.

| Capability | Product decision | Engineering evidence/status | Public claim now |
|---|---|---|---|
| US options API | Approved direction; phase I data selected | REST in design/build plan; no customer release established by this audit | Approved “we're building” sentence only |
| MCP server | Approved direction; phase I data selected, tool contract open | No MCP implementation/build step found in current platform design | Approved “we're building” sentence only |
| Live quotes, trades, volume, daily OI | Commercial phase I selected | dxFeed recording/replay and chain prototypes; serving pipeline still to integrate | Planned phase I field list; no present access claim |
| Contract reference data | Platform engineering planned; public schema draft | IPF parsing exists; permanent public ID registry/schema proposed | No coverage guarantee |
| IV and delta/gamma/theta/vega/rho | Commercial phase I selected | calc + analytics merged, reference/replay tests; full-session validation remains | Planned phase I IV/Greeks; no production accuracy/access promise |
| Per-expiration and 9/30/93-day volatility indexes | Platform engineering approved; commercial slice unselected | analytics merged; live-market comparison remains | No index-equivalence or availability promise |
| Buy/sell/undecided flow, premium/count, windows | Platform engineering approved; commercial slice unselected | flow merged; recorded-data reconciliation; ingest backfill required | No availability promise |
| OI/volume/windowed exposures and strike profiles | Platform engineering approved; commercial slice unselected | T-0108 in progress at baseline | No dealer-position inference or availability promise |
| WebSocket streaming | Platform engineering planned; founder's original commercial roadmap idea | Edge/load prototypes exist; not an integrated public service | No launch commitment |
| Scanner | Founder idea; platform engineering planned | Scan architecture specified; no release; user SQL explicitly deferred | No SQL/scanner availability promise |
| Time and Sales | Commercial phase I selected; historical range unselected | Recording/parser/replay exist; customer query service not established | Planned phase I trade records; no historical range claim |
| Historical OHLCV/custom minute bars since 2014 | Founder idea, not selected | No established serving implementation or 2014 coverage in platform | No date/granularity promise |
| Bulk exports | Platform engineering planned; commercial scope unselected | Design/build plan | No availability promise |
| Equity/index prices | Licensed Polygon source selected for platform inputs | Integration/public fields proposed; separate commercial product unselected | No separate stock-data offer |
| Calculators, payoff/portfolio tools, backtesting | Founder future ideas | Not selected for implementation here | No commitment |
| Hosted jobs, alerts and workflows | Founder future ideas | Not selected for implementation here | No commitment |

## Release and commercial decisions still open

- Commercial phase I coverage and data families are selected above. Open: precise field semantics, API/MCP tools,
  historical range/retention, usage limits, support, price and date. Other analytics in the platform are not
  automatically included in this commercial release.
- Platform engineering **Phase 1** currently means SPX-only ingest → relay → compute → edge → browser on a dev
  host for invited testing. It is not the commercial phase 1 release; do not conflate them.
- ADR 0011 leaves the product's delivery relationship with `optionsdata-ai/platform` undecided. This register
  tracks that platform as the relevant engineering effort without silently approving a commercial architecture,
  account migration, subscription unification or changed build order.
- Six public-schema choices await jbt (schema §7): IDs/symbols, forward-vs-spot Greeks, units/signs, headline volume,
  streaming precision, and chain root grouping. Existing calculation conventions are not blanket schema approval.
- Reconcile MCP delivery with the platform build plan when selecting the release. No hidden implementation task
  or date is created by this document.
- Founder-reported feeds/licenses: dxFeed/OPRA, Massive business, FMP. Availability of a feed is not evidence
  that every redistribution mode, professional use, field or historical range is cleared for a public offer.
  Record serving entitlements and tested coverage before claiming them; do not reopen previously settled input
  licenses without new evidence.

## Change log

- 2026-10-13.1: approved clearer homepage hierarchy: explanation before compact signup, secondary labeled
  sample-data exploration, prompt disclosure, scannable coverage labels and unified frame/footer. Supersedes
  literal full-width intake and forced two-line desktop title. No live-access or backend activation change.

- 2026-10-12.1: self-service design with invited-first rollout; minimal-step onboarding with question, artifact
  and code paths; labeled demo data; Google and email sign-in. First useful answer remains user-dependent.
  Assistant-guided connection is a proposed experience requiring actual-client proof; public availability unchanged.

- 2026-10-11.2: jbt requested dark mode for the landing page. Charcoal/off-white with a readable green accent;
  shared pages follow the theme. Layout, approved copy, intake/consent and public commitments unchanged.

- 2026-10-11.1: second lead line added to the homepage block (jbt: "lets go with your pick"); feed vendor's name removed
  from the public methodology (jbt, 2026-10-10). No price, date or availability claim.

- 2026-10-10.4: seventh homepage line removed (jbt: awkward). Public methodology page written and published; the
  homepage's commitments are documented there and tracked as platform launch requirements. No price, date or
  availability claim.

- 2026-10-10.3: jbt approved the precise offer block for the homepage (source-tagged lines: OPRA / in-house),
  replacing the single sentence; eyebrow and ADOM footer line removed. Still no price, date or availability claim.

- 2026-10-10.2: jbt directed a concise, direct homepage in alphai.io's editorial style with the intake form only:
  no pricing, no product promise, no coverage or feature list. Supersedes the ConvexValue-inspired visuals and
  the Phase I scope block on the homepage. Guides and privacy page unchanged in scope. No new commercial decision.

- 2026-10-10.1: founder established that purchases and renewals must stand on delivered product value, with
  affordable live bid/ask and near-expiry IV/Greeks as concrete customer needs. Additional packaging and price
  remain proposals. No new public availability claim or launch scope selected.

- 2026-10-09.3: jbt rejected the first Phase I visual style; directed adoption of convexvalue.com theme and
  modern illustration language. Feature scope, price/date boundaries and launch-update consent are unchanged.

- 2026-10-09.2: jbt selected all US equity/index options (OPRA), chain fields and Time and Sales for commercial
  phase I; authorized landing scope copy and illustrative data visuals. No availability/date/price promise.
- 2026-10-09.1: established shared definition and status separation; no new feature, price or launch commitment.
