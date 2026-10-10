# Building Fintech and banking products with opendraft

> Banking, payments, trading, personal finance and lending products. Money moves, so precision, clear fees and honest balances matter more than delight; many actions cannot be undone.

Read this before building for this domain. Follow the rules in https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms.txt as well. Names below link to each component's page (props, types, example).

## Use this playbook when the product involves

fintech, banking, bank, payments, payment, transfer, card, neobank, trading, brokerage, portfolio, personal finance, budget, lending, loan, mortgage, invoice, crypto.

## Principles for this domain

- Format money with the locale and ISO 4217 currency (`Intl.NumberFormat`), show the currency on every amount that might be ambiguous, align figures right in `tabular-nums` and keep minor units. Never compute with floating point; use integer minor units or a decimal library.
- Treat transfers, payouts and trades as irreversible: show a review step with payee, amount, fee, rate and arrival time, then confirm. Require step-up authentication (a one-time code or biometric) before a high-risk action.
- Show every fee, rate and the final total before the user commits, not after. If the amount can change (FX, market orders), say so and show when the quote expires.
- Be honest about balance: label Available versus Pending versus Current, show `as of` time, and mark data that is delayed. Never show an optimistic balance as if it had settled.
- Never use red and green alone for gain and loss; add a sign and an arrow or word (`+2.4%`, `Down`). `stat`'s `delta` does this (arrow plus a screen-reader word) and `goodWhen` says which direction is good news, so a falling expense reads as good. Do not use red for a number that is merely negative in an accounting sense when it is not an error.
- Keep an audit trail the user can see (activity, statements, who approved what) and mask account and card numbers by default, showing only the last four digits with an explicit reveal and `copy-button`.
- opendraft is presentation only: it does not move money, price orders or check balances, and nothing here is a compliance or regulatory guarantee. Show regulatory disclosures and risk warnings your jurisdiction requires as plain text next to the action, and take quotes, balances and fees only from your backend.

## What the product needs, and what to use

Fit: **Ready** means use as is. **Adapt** means it works with the caveat given. **Gap** means nothing fits yet: build it from primitives and follow the principles above.

### Account overview and balances

- Fit: **Ready**
- Use: [Stat](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/stat.md), [Badge](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/badge.md), [Animated Number](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/animated-number.md), [Tabs](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/tabs.md), [Data Table](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/table.md), [Page Header](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/page-header.md)
- How: `stat` tiles for each account: `value` and `hint` accept ReactNode, so pass a pre-formatted string and an `as of` hint; `delta` gives a signed change with an arrow. `animated-number` takes a plain number and an `Intl.NumberFormat` `format` (for example currency), so use it only for a hero balance and convert from minor units for display only; never inside tables.

### Transaction history and search

- Fit: **Adapt**
- Use: [Data Table](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/table.md), [Input](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/input.md), [Select](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/select.md), [Date Range Picker](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/date-range-picker.md), [Badge](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/badge.md), [Copy Button](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/copy-button.md), [Button](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/button.md)
- How: `table` is virtualized (fixed `rowHeight`, `height` or `maxHeight`), sortable, can load more with `onEndReached` and `loading`, and scrolls sideways on phones, so keep Description, Amount and Date as the core columns. Right-align the amount in a `cell` renderer; status `badge` (Pending, Posted, Failed). `selectable` with `onSelectionChange` (ids) and `getRowId` lets people pick rows; an Export `button` runs your own CSV export. `copy-button` for a reference id.
- Missing: No built-in search or filter bar: add `input`, `select` and `date-range-picker` yourself and pass the filtered rows to `table`. `filter-table` is a demo task table with fixed columns (task, date, status todo/progress/done, owner), and `selection-actions` is an AI text-rewrite bar, so neither is for transactions.

### Send money / transfer with review and step-up auth

- Fit: **Adapt**
- Use: [Stepper](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/stepper.md), [Field](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/field.md), [Select](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/select.md), [Input](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/input.md), [OTP Input](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/otp-input.md), [Dialog](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/dialog.md), [Stat](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/stat.md), [Timeline](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/timeline.md), [Copy Button](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/copy-button.md), [Alert](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/alert.md), [Button](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/button.md)
- How: `stepper` flow (payee, amount, review, verify, done; `description` can carry the chosen payee). Review step is a plain list or `stat`/`StatGroup` of payee, amount, fee, rate and arrival, then a confirm `button` (optionally in a `dialog`). `otp-input` for step-up (`onComplete`, `invalid`). Receipt: `alert` success, `stat`s, a `copy-button` for the reference and a `timeline` of the transfer status (initiated, processing, arrives).
- Missing: No review or receipt component. `order-confirmation` is ticket-shaped (QR tickets, qty by price lines, email sentence) and `approval-card` ends with an Approved badge, so neither suits a transfer. `otp-input` has no resend timer or lockout; those are yours.

### Card checkout and payment methods

- Fit: **Gap**
- Use: [Field](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/field.md), [Input](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/input.md), [Radio Group](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/radio-group.md), [Stepper](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/stepper.md), [Badge](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/badge.md), [Alert](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/alert.md), [Button](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/button.md)
- How: The `checkout` block is built for ticket and booking purchases: details step is name, email, phone, an 'I'm booking for someone else' attendee and a delivery choice (digital pass by email or collect at front desk), payment is card or pay later, and the confirmation prints a ticket pass per item. Most of this copy is fixed. Build a payment form from `field`, `input` and `radio-group` (saved methods as radio cards), a `stepper`, and mount your provider's hosted fields for the card.
- Missing: `checkout` does not fit bank or card products and its card form cannot be lifted out of the block. Compose from primitives.

### Portfolio, positions and market data

- Fit: **Adapt**
- Use: [Stat](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/stat.md), [Data Table](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/table.md), [Analytics Dashboard](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/analytics-dashboard.md), [Tabs](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/tabs.md), [Badge](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/badge.md), [Insight Cards](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/insight-cards.md)
- How: Holdings in a `table` with a signed change cell (sign, arrow or word, not color alone). `analytics-dashboard` can be relabelled for portfolio value: KPI metrics take `Intl` `format` (currency), the chart is a single-series line with hover tooltip and metric tabs, the `channels` share bar can show asset allocation, `labels.ranges` can read 1W, 1M, 3M, and `valueColumn`/`formatVisitors`/`formatConversion` repurpose table columns (quantity, weight, value). `insight-cards` also exports `InsightChart` (line, fill, threshold, tooltip).
- Missing: No price chart (candlestick, crosshair, axes, ranges beyond 7/30/90 days), no order book and no live ticker; use a charting library and keep numbers in tabular figures. `analytics-dashboard` rows are shaped name, visitors, conversion (0-1) and value, so the mapping is a relabel.

### Place a trade or order

- Fit: **Adapt**
- Use: [Tabs](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/tabs.md), [Field](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/field.md), [Input](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/input.md), [Slider](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/slider.md), [Quantity Stepper](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/quantity-stepper.md), [Select](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/select.md), [Dialog](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/dialog.md), [Alert](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/alert.md), [Stat](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/stat.md)
- How: `tabs` for Buy and Sell (label them in words); `quantity-stepper` for whole units (`min`, `max`, `step`) or `input` for fractional ones; `slider` with `marks` and `formatValue` for a percent of balance; an order preview in a `dialog` with `stat`s for estimated cost, fees and quote time, and a confirm button. An `alert` for market-closed or price-moved warnings.
- Missing: No market-depth or order-ticket component; the estimated price must come from your pricing service and show when it was quoted.

### Spending insights and budgets

- Fit: **Adapt**
- Use: [Progress](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/progress.md), [Stat](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/stat.md), [Analytics Dashboard](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/analytics-dashboard.md), [Data Table](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/table.md)
- How: `progress` with `tone="auto"` measures consumption by default (a fuller bar turns warning, then destructive), which suits category budgets; set `label` and `valueLabel` (`$320 of $400`). `stat` for totals with `delta` and `goodWhen="down"` for spend. `analytics-dashboard` (relabelled) gives KPI cards, a monthly line chart and a stacked share bar for category breakdown.
- Missing: No donut chart and no cash-flow (Sankey) chart; the category breakdown is a single stacked horizontal bar with five tones. `analytics-dashboard` ranges are fixed at 7, 30 and 90 day tabs (relabel them).

### Loan or credit application

- Fit: **Adapt**
- Use: [Stepper](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/stepper.md), [Field](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/field.md), [Slider](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/slider.md), [Repeater Field](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/repeater-field.md), [Dropzone](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/dropzone.md), [Stat](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/stat.md), [Data Table](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/table.md), [Alert](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/alert.md), [Timeline](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/timeline.md)
- How: `slider` for amount and term (`formatValue`, `marks`), a live repayment summary in `stat`s, `repeater-field` for income sources or existing debts, `dropzone` for income documents, and an `alert` plus `timeline` for 'application received' and next steps.
- Missing: No amortization schedule with built-in calculations; compute it server-side and render it with `table`. `order-confirmation` is ticket-shaped, so it is not used for the submitted state.

### KYC and identity verification

- Fit: **Adapt**
- Use: [Stepper](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/stepper.md), [Field](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/field.md), [Dropzone](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/dropzone.md), [OTP Input](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/otp-input.md), [Status Indicator](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/status-indicator.md), [Badge](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/badge.md), [Alert](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/alert.md)
- How: `stepper` (with `description`) for the checks; `dropzone` with `accept`, `maxSize` and `capture="environment"` takes an ID photo straight from the phone camera as a file; `otp-input` for phone or email codes. Show each check with a `status-indicator` using `label` and `tone` overrides (Pending, Verified, Needs attention) or a `badge`.
- Missing: `capture` only opens the device camera for a still image: there is no live camera preview, document frame overlay or liveness check. Use your identity provider's SDK for those.

### Security, limits and audit trail

- Fit: **Adapt**
- Use: [Switch](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/switch.md), [Field](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/field.md), [Slider](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/slider.md), [Data Table](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/table.md), [Timeline](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/timeline.md), [Dialog](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/dialog.md), [Alert](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/alert.md), [Settings Page](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/settings-page.md)
- How: Card freeze and alert preferences as `switch` rows, limits with `field` or `slider`, login and device history in a `table` or `timeline` (mono timestamps, status markers), and a type-to-confirm `dialog` for closing an account. `settings-page` can supply the grouped switch rows (its `notifications` groups) and a type-to-confirm danger zone (`dangerLabels`, `sections`).
- Missing: `settings-page` sections are fixed to profile, notifications, team and billing and the danger-zone confirmation requires typing the `workspaceName`; there is no security, devices or limits section, so compose those from the primitives.

## Libraries and services that pair well

- Payments and card acceptance: Stripe Elements, Adyen Drop-in, Braintree. Mount the provider's hosted fields inside your own payment form (built from `field` and `radio-group`) so card data never touches your app; send your backend a token only.
- Bank account linking and open banking data: Plaid Link, TrueLayer, MX. These open their own modal; surround it with an opendraft `dialog` that explains what is shared and wait for the result before updating balances.
- Money math and currency formatting: Intl.NumberFormat, dinero.js, decimal.js. Pass already formatted strings to `stat` and to `table` cell renderers; keep amounts in integer minor units in your data layer.
- Price and performance charts: TradingView Lightweight Charts, Recharts, visx. Only a basic line chart ships (`InsightChart` in `insight-cards`, and the chart inside `analytics-dashboard`). For price charts with axes, crosshair or candlesticks, theme a library with design tokens and add a text value readout so gain and loss do not rely on color.
- Identity verification and fraud signals: Persona, Onfido, Sumsub. Use their SDK for document and liveness capture and show the outcome with `status-indicator` and `alert`.

## Typical screens

- **Accounts overview**: [Page Header](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/page-header.md) + [Stat](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/stat.md) + [Tabs](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/tabs.md) + [Data Table](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/table.md) + [Alert](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/alert.md)
- **Transactions**: [Page Header](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/page-header.md) + [Date Range Picker](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/date-range-picker.md) + [Input](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/input.md) + [Select](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/select.md) + [Data Table](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/table.md) + [Badge](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/badge.md) + [Button](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/button.md)
- **Send money**: [Page Header](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/page-header.md) + [Stepper](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/stepper.md) + [Field](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/field.md) + [Select](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/select.md) + [Input](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/input.md) + [OTP Input](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/otp-input.md) + [Dialog](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/dialog.md) + [Stat](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/stat.md) + [Timeline](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/timeline.md) + [Copy Button](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/copy-button.md) + [Alert](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/alert.md)
- **Portfolio**: [Page Header](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/page-header.md) + [Stat](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/stat.md) + [Analytics Dashboard](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/analytics-dashboard.md) + [Data Table](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/table.md)
- **Security and limits**: [Page Header](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/page-header.md) + [Switch](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/switch.md) + [Field](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/field.md) + [Data Table](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/table.md) + [Timeline](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/timeline.md) + [Dialog](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/dialog.md) + [Alert](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/alert.md)

## Install the starter kit

One command installs the theme and the components this playbook uses:

```bash
npx shadcn@latest add @opendraft/kit-fintech
```

## Known gaps

- Transaction history and search: No built-in search or filter bar: add `input`, `select` and `date-range-picker` yourself and pass the filtered rows to `table`. `filter-table` is a demo task table with fixed columns (task, date, status todo/progress/done, owner), and `selection-actions` is an AI text-rewrite bar, so neither is for transactions.
- Send money / transfer with review and step-up auth: No review or receipt component. `order-confirmation` is ticket-shaped (QR tickets, qty by price lines, email sentence) and `approval-card` ends with an Approved badge, so neither suits a transfer. `otp-input` has no resend timer or lockout; those are yours.
- Card checkout and payment methods: `checkout` does not fit bank or card products and its card form cannot be lifted out of the block. Compose from primitives.
- Portfolio, positions and market data: No price chart (candlestick, crosshair, axes, ranges beyond 7/30/90 days), no order book and no live ticker; use a charting library and keep numbers in tabular figures. `analytics-dashboard` rows are shaped name, visitors, conversion (0-1) and value, so the mapping is a relabel.
- Place a trade or order: No market-depth or order-ticket component; the estimated price must come from your pricing service and show when it was quoted.
- Spending insights and budgets: No donut chart and no cash-flow (Sankey) chart; the category breakdown is a single stacked horizontal bar with five tones. `analytics-dashboard` ranges are fixed at 7, 30 and 90 day tabs (relabel them).
- Loan or credit application: No amortization schedule with built-in calculations; compute it server-side and render it with `table`. `order-confirmation` is ticket-shaped, so it is not used for the submitted state.
- KYC and identity verification: `capture` only opens the device camera for a still image: there is no live camera preview, document frame overlay or liveness check. Use your identity provider's SDK for those.
- Security, limits and audit trail: `settings-page` sections are fixed to profile, notifications, team and billing and the danger-zone confirmation requires typing the `workspaceName`; there is no security, devices or limits section, so compose those from the primitives.

Docs: https://ui-system-virid.vercel.app/docs/use-cases
