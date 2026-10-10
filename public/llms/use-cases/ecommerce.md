# Building E-commerce and marketplaces products with opendraft

> Storefronts, marketplaces and seller dashboards. Shoppers need honest prices and stock and a fast path to pay; sellers need to manage orders and inventory in bulk.

Read this before building for this domain. Follow the rules in https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms.txt as well. Names below link to each component's page (props, types, example).

## Use this playbook when the product involves

ecommerce, e-commerce, store, storefront, shop, marketplace, cart, checkout, product, catalog, inventory, orders, seller, merchant, retail, returns, wishlist, discount.

## Principles for this domain

- Be honest about price and availability: show the total with tax, shipping and fees before checkout, strike through a compare-at price only when it is real, and show stock states in words (In stock, Only 3 left, Sold out) from live data.
- Persist the cart across sessions and devices, never silently change a quantity or price, and if something changed since the user added it, say what changed and let them decide.
- Show trust signals where the decision happens: delivery date, return window, secure payment note, ratings with the review count and who can leave a review. Do not invent urgency such as fake countdowns.
- Offer guest checkout and fast payment options; ask for the fewest fields, validate inline and keep the order summary visible while the user fills the form.
- State returns, refunds and shipping costs in plain words before purchase, and give the order status and the next step on every order screen.
- Make sold-out and error states useful: offer a back-in-stock notification or similar items, keep filters on a no-results page and keep the user's progress when a payment fails.

## What the product needs, and what to use

Fit: **Ready** means use as is. **Adapt** means it works with the caveat given. **Gap** means nothing fits yet: build it from primitives and follow the principles above.

### Browse, search and filter products

- Fit: **Adapt**
- Use: [Catalog](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/catalog.md), [Input](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/input.md), [Select](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/select.md), [Switch](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/switch.md), [Badge](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/badge.md), [Empty State](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/empty-state.md), [Skeleton](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/skeleton.md)
- How: `catalog` already has search, category chips, sort, price filter, availability switch, card grid, empty state and loading skeleton, with an ISO `currency` prop.
- Missing: Its item shape is event-oriented (host, date, capacity, remaining) so product fields like brand, variants and ratings need relabelling or a custom card; there are no faceted multi-filters such as size or color.

### Product detail with variants and purchase panel

- Fit: **Adapt**
- Use: [Detail Page](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/detail-page.md), [Tabs](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/tabs.md), [Accordion](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/accordion.md), [Quantity Stepper](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/quantity-stepper.md), [Radio Group](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/radio-group.md), [Badge](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/badge.md), [Progress](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/progress.md)
- How: `detail-page` has media, key facts, tabs, FAQ, a sticky purchase panel with tiers, quantity and a running total; map tiers to variants or sizes.
- Missing: No image gallery or zoom, no color swatches and no star rating or review list.

### Shopping cart and mini-cart

- Fit: **Adapt**
- Use: [Drawer](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/drawer.md), [Quantity Stepper](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/quantity-stepper.md), [Button](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/button.md), [Badge](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/badge.md), [Empty State](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/empty-state.md), [Toast](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/sonner.md)
- How: A cart in a `drawer` with `quantity-stepper` lines and a subtotal; the `checkout` summary has the same pattern.
- Missing: No standalone cart component; build the line list yourself and keep it in persistent storage on your backend.

### Checkout (guest or account) and payment

- Fit: **Adapt**
- Use: [Checkout](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/checkout.md), [Order Confirmation](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/order-confirmation.md), [Stepper](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/stepper.md), [Field](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/field.md), [Radio Group](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/radio-group.md)
- How: `checkout` is a three-step flow with a sticky order summary, quantity steppers, discount codes and a masked card form; pass `items`, `fees`, `currency` and `discountCodes`.
- Missing: Its details step is ticket-shaped (attendee, email or desk delivery); there is no shipping address form, shipping-method picker or wallet-button slot, so add those with `field` and `radio-group`.

### Order confirmation and tracking

- Fit: **Ready**
- Use: [Order Confirmation](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/order-confirmation.md), [Stepper](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/stepper.md), [Timeline](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/timeline.md), [Progress](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/progress.md), [Copy Button](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/copy-button.md), [Badge](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/badge.md)
- How: `order-confirmation` for the receipt (relabel for physical goods); `stepper` or `timeline` for Placed, Packed, Shipped and Delivered with a tracking number and `copy-button`.

### Returns and refunds

- Fit: **Adapt**
- Use: [Stepper](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/stepper.md), [Radio Group](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/radio-group.md), [Textarea](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/textarea.md), [Dropzone](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/dropzone.md), [Order Confirmation](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/order-confirmation.md), [Alert](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/alert.md)
- How: A `stepper` flow: select items, reason, photos with `dropzone`, then choose refund or exchange and confirm; show the return deadline in an `alert`.
- Missing: No printable return-label view; render it from your carrier's PDF.

### Seller dashboard: sales and performance

- Fit: **Adapt**
- Use: [Analytics Dashboard](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/analytics-dashboard.md), [Stat](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/stat.md), [Insight Cards](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/insight-cards.md), [Date Range Picker](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/date-range-picker.md), [Data Table](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/table.md)
- How: Relabel `analytics-dashboard` for revenue, orders and conversion, with `valueColumn` for revenue.
- Missing: The range tabs are fixed at 7, 30 and 90 days and the table columns are page-analytics shaped; no time-series chart with comparison.

### Seller order and inventory management

- Fit: **Ready**
- Use: [Filter Table](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/filter-table.md), [Data Table](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/table.md), [Tabs](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/tabs.md), [Selection Actions](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/selection-actions.md), [Badge](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/badge.md), [Progress](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/progress.md), [Records Table](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/records-table.md)
- How: Tabs for New, To ship and Returns, bulk label and fulfil via `selection-actions`, `progress` with `invert` for stock levels.

### Create and edit a product listing

- Fit: **Adapt**
- Use: [Field](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/field.md), [Input](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/input.md), [Textarea](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/textarea.md), [Select](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/select.md), [Repeater Field](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/repeater-field.md), [Dropzone](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/dropzone.md), [Switch](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/switch.md), [Stepper](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/stepper.md)
- How: `repeater-field` for variants and prices, `dropzone` for photos.
- Missing: No rich text editor for descriptions and no image reordering or cropping.

### Promotions and discount codes

- Fit: **Ready**
- Use: [Data Table](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/table.md), [Dialog](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/dialog.md), [Field](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/field.md), [Date Range Picker](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/date-range-picker.md), [Switch](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/switch.md), [Badge](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/badge.md)
- How: A `table` of codes with a status `badge`, a `dialog` to create one, and `date-range-picker` for the validity window.

## Libraries and services that pair well

- Commerce backend and product data: Shopify Storefront API, Medusa, commercetools. Map the product, cart and order objects to the props of `catalog`, `detail-page` and `checkout` in an adapter; keep the cart on the server so it persists across devices.
- Payments, wallets and tax: Stripe, Adyen, PayPal. Mount hosted card fields in place of the `checkout` card inputs; `onPay` should receive a token, and tax should come from the provider so the total shown is the total charged.
- Product search and filtering: Algolia, Typesense, Meilisearch. Feed results into `catalog` through its items prop; faceted filters beyond price and category are not built in and need your own controls.
- Shipping rates and tracking: Shippo, EasyPost, AfterShip. Use their rates in the checkout `fees` and their tracking events in a `timeline`.
- Reviews and ratings: Yotpo, Judge.me, Trustpilot. No rating component ships in opendraft; show the average and count as plain text next to the stars, and avoid displaying reviews you cannot verify.

## Typical screens

- **Shop and category**: [Site Header](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/site-header.md) + [Catalog](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/catalog.md)
- **Product page**: [Site Header](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/site-header.md) + [Detail Page](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/detail-page.md) + [Accordion](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/accordion.md) + [Badge](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/badge.md)
- **Cart and checkout**: [Site Header](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/site-header.md) + [Checkout](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/checkout.md) + [Order Confirmation](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/order-confirmation.md)
- **Seller orders**: [Page Header](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/page-header.md) + [Tabs](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/tabs.md) + [Filter Table](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/filter-table.md) + [Selection Actions](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/selection-actions.md) + [Badge](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/badge.md)
- **Seller overview**: [Page Header](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/page-header.md) + [Stat](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/stat.md) + [Analytics Dashboard](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/analytics-dashboard.md) + [Date Range Picker](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/date-range-picker.md)

## Install the starter kit

One command installs the theme and the components this playbook uses:

```bash
npx shadcn@latest add @opendraft/kit-ecommerce
```

## Known gaps

- Browse, search and filter products: Its item shape is event-oriented (host, date, capacity, remaining) so product fields like brand, variants and ratings need relabelling or a custom card; there are no faceted multi-filters such as size or color.
- Product detail with variants and purchase panel: No image gallery or zoom, no color swatches and no star rating or review list.
- Shopping cart and mini-cart: No standalone cart component; build the line list yourself and keep it in persistent storage on your backend.
- Checkout (guest or account) and payment: Its details step is ticket-shaped (attendee, email or desk delivery); there is no shipping address form, shipping-method picker or wallet-button slot, so add those with `field` and `radio-group`.
- Returns and refunds: No printable return-label view; render it from your carrier's PDF.
- Seller dashboard: sales and performance: The range tabs are fixed at 7, 30 and 90 days and the table columns are page-analytics shaped; no time-series chart with comparison.
- Create and edit a product listing: No rich text editor for descriptions and no image reordering or cropping.

Docs: https://ui-system-virid.vercel.app/docs/use-cases
