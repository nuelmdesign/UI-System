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
- Never use red and green alone for gain and loss; add a sign and an arrow or word (`+2.4%`, `Down`). Do not use red for a number that is merely negative in an accounting sense when it is not an error.
- Keep an audit trail the user can see (activity, statements, who approved what) and mask account and card numbers by default, showing only the last four digits with an explicit reveal and `copy-button`.

## What the product needs, and what to use

Fit: **Ready** means use as is. **Adapt** means it works with the caveat given. **Gap** means nothing fits yet: build it from primitives and follow the principles above.

### Account overview and balances

- Fit: **Ready**
- Use: [Stat](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/stat.md), [Badge](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/badge.md), [Animated Number](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/animated-number.md), [Tabs](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/tabs.md), [Data Table](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/table.md), [Page Header](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/page-header.md)
- How: `stat` tiles for each account with an `as of` hint; use `animated-number` only on a hero balance, never inside tables. Pass formatted strings so the currency is exact.

### Transaction history and search

- Fit: **Ready**
- Use: [Filter Table](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/filter-table.md), [Data Table](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/table.md), [Date Range Picker](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/date-range-picker.md), [Badge](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/badge.md), [Selection Actions](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/selection-actions.md), [Copy Button](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/copy-button.md)
- How: Status `badge` for Pending, Posted and Failed; virtualized `table` for long histories; export through `selection-actions`.

### Send money / transfer with review and step-up auth

- Fit: **Ready**
- Use: [Stepper](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/stepper.md), [Field](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/field.md), [Select](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/select.md), [Input](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/input.md), [Approval Card](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/approval-card.md), [OTP Input](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/otp-input.md), [Dialog](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/dialog.md), [Order Confirmation](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/order-confirmation.md)
- How: A `stepper` flow: payee, amount, review, `otp-input` for step-up, then `order-confirmation` as the receipt. Use `approval-card` to show the full fee and amount summary.

### Card checkout and payment methods

- Fit: **Adapt**
- Use: [Checkout](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/checkout.md), [Radio Group](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/radio-group.md), [Field](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/field.md), [Order Confirmation](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/order-confirmation.md), [Badge](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/badge.md)
- How: `checkout` has a masked card form and a summary, and it never sends full card data to your code; mount your provider's hosted fields in its place.
- Missing: Its details step is shaped for ticket purchases (attendee, delivery); relabel or build a plain payment form from `field` for bank products.

### Portfolio, positions and market data

- Fit: **Adapt**
- Use: [Stat](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/stat.md), [Data Table](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/table.md), [Analytics Dashboard](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/analytics-dashboard.md), [Insight Cards](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/insight-cards.md), [Badge](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/badge.md), [Tabs](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/tabs.md)
- How: Holdings in a `table` with signed change values; relabel `analytics-dashboard` for portfolio performance.
- Missing: No price chart (candlestick or line with ranges and crosshair), no order book and no live ticker; use a charting library and keep numbers in tabular figures.

### Place a trade or order

- Fit: **Adapt**
- Use: [Field](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/field.md), [Input](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/input.md), [Slider](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/slider.md), [Quantity Stepper](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/quantity-stepper.md), [Select](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/select.md), [Approval Card](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/approval-card.md), [Tabs](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/tabs.md), [Dialog](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/dialog.md)
- How: `tabs` for Buy and Sell, `quantity-stepper` for units, an `approval-card` for the order preview with estimated cost and fees.
- Missing: No market-depth or order-ticket component; the estimated price must come from your pricing service and show when it was quoted.

### Spending insights and budgets

- Fit: **Adapt**
- Use: [Progress](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/progress.md), [Insight Cards](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/insight-cards.md), [Stat](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/stat.md), [Analytics Dashboard](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/analytics-dashboard.md), [Date Range Picker](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/date-range-picker.md)
- How: `progress` with a warning tone for category budgets; `insight-cards` for monthly trends.
- Missing: No donut or category-breakdown chart and no cash-flow (Sankey) chart.

### Loan or credit application

- Fit: **Adapt**
- Use: [Stepper](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/stepper.md), [Field](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/field.md), [Slider](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/slider.md), [Repeater Field](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/repeater-field.md), [Dropzone](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/dropzone.md), [Approval Card](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/approval-card.md), [Order Confirmation](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/order-confirmation.md)
- How: `slider` for amount and term, a live repayment summary in `stat`, `dropzone` for income documents.
- Missing: No amortization schedule table with built-in calculations; compute it server-side and render it with `table`.

### KYC and identity verification

- Fit: **Adapt**
- Use: [Stepper](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/stepper.md), [Field](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/field.md), [Dropzone](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/dropzone.md), [OTP Input](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/otp-input.md), [Status Indicator](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/status-indicator.md), [Alert](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/alert.md)
- How: `stepper` with a clear status for each check (Pending, Verified, Needs attention) and `dropzone` for ID upload.
- Missing: No camera capture or liveness-check UI; use your identity provider's SDK.

### Security, limits and audit trail

- Fit: **Ready**
- Use: [Settings Page](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/settings-page.md), [Data Table](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/table.md), [Switch](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/switch.md), [Dialog](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/dialog.md), [Timeline](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/timeline.md), [Alert](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/alert.md)
- How: Card freeze and limits as `switch` and `field`, device and login history in a `table` or `timeline`, a type-to-confirm `dialog` for closing an account.

## Libraries and services that pair well

- Payments and card acceptance: Stripe Elements, Adyen Drop-in, Braintree. Mount the provider's hosted fields in place of the `checkout` card inputs so card data never touches your app; opendraft's `onPay` should receive a token only.
- Bank account linking and open banking data: Plaid Link, TrueLayer, MX. These open their own modal; surround it with an opendraft `dialog` that explains what is shared and wait for the result before updating balances.
- Money math and currency formatting: Intl.NumberFormat, dinero.js, decimal.js. Pass already formatted strings to `stat` and `table`; keep amounts in integer minor units in your data layer.
- Price and performance charts: TradingView Lightweight Charts, Recharts, visx. No price chart ships in opendraft; theme the chart with design tokens and add a text value readout so gain and loss do not rely on color.
- Identity verification and fraud signals: Persona, Onfido, Sumsub. Use their SDK for document and liveness capture and show the outcome with `status-indicator` and `alert`.

## Typical screens

- **Accounts overview**: [Page Header](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/page-header.md) + [Stat](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/stat.md) + [Tabs](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/tabs.md) + [Data Table](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/table.md) + [Alert](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/alert.md)
- **Transactions**: [Page Header](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/page-header.md) + [Date Range Picker](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/date-range-picker.md) + [Filter Table](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/filter-table.md) + [Badge](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/badge.md) + [Selection Actions](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/selection-actions.md)
- **Send money**: [Page Header](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/page-header.md) + [Stepper](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/stepper.md) + [Field](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/field.md) + [Approval Card](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/approval-card.md) + [OTP Input](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/otp-input.md) + [Order Confirmation](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/order-confirmation.md)
- **Portfolio**: [Page Header](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/page-header.md) + [Stat](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/stat.md) + [Analytics Dashboard](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/analytics-dashboard.md) + [Data Table](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/table.md)
- **Security and limits**: [Settings Page](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/settings-page.md) + [Data Table](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/table.md) + [Switch](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/switch.md) + [Timeline](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/timeline.md)

## Install the starter kit

One command installs the theme and the components this playbook uses:

```bash
npx shadcn@latest add @opendraft/kit-fintech
```

## Known gaps

- Card checkout and payment methods: Its details step is shaped for ticket purchases (attendee, delivery); relabel or build a plain payment form from `field` for bank products.
- Portfolio, positions and market data: No price chart (candlestick or line with ranges and crosshair), no order book and no live ticker; use a charting library and keep numbers in tabular figures.
- Place a trade or order: No market-depth or order-ticket component; the estimated price must come from your pricing service and show when it was quoted.
- Spending insights and budgets: No donut or category-breakdown chart and no cash-flow (Sankey) chart.
- Loan or credit application: No amortization schedule table with built-in calculations; compute it server-side and render it with `table`.
- KYC and identity verification: No camera capture or liveness-check UI; use your identity provider's SDK.

Docs: https://ui-system-virid.vercel.app/docs/use-cases
