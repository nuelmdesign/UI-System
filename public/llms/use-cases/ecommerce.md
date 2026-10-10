# Building E-commerce and marketplaces products with opendraft

> Storefronts, marketplaces and seller dashboards. Shoppers need honest prices and stock and a fast path to pay; sellers need to manage orders and inventory in bulk.

Read this before building for this domain. Follow the rules in https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms.txt as well. Names below link to each component's page (props, types, example).

## Use this playbook when the product involves

ecommerce, e-commerce, store, storefront, shop, marketplace, cart, checkout, product, catalog, inventory, orders, seller, merchant, retail, returns, wishlist, discount.

## Principles for this domain

- Be honest about price and availability: show the total with tax, shipping and fees before checkout, strike through a compare-at price only when it is real, and show stock states in words (In stock, Only 3 left, Sold out) from live data. `progress` with `tone="auto"` and `invert` can show remaining stock, but pair it with the words.
- Persist the cart across sessions and devices, never silently change a quantity or price, and if something changed since the user added it, say what changed (an `alert`) and let them decide.
- Show trust signals where the decision happens: delivery date, return window, secure payment note, ratings with the review count and who can leave a review. Do not invent urgency such as fake countdowns or invented stock numbers.
- Offer guest checkout and fast payment options; ask for the fewest fields, validate inline and keep the order summary visible while the user fills the form.
- State returns, refunds and shipping costs in plain words before purchase, and give the order status and the next step on every order screen.
- Make sold-out and error states useful: offer a back-in-stock notification or similar items, keep filters on a no-results page and keep the user's progress when a payment fails.
- Check which opendraft blocks fit before using them: `catalog`, `detail-page`, `checkout` and `order-confirmation` are built for dated, seat-limited, ticketed things (classes, tours, events). For physical goods compose the screens from primitives; the playbook below says which.

## What the product needs, and what to use

Fit: **Ready** means use as is. **Adapt** means it works with the caveat given. **Gap** means nothing fits yet: build it from primitives and follow the principles above.

### Browse, search and filter products

- Fit: **Gap**
- Use: [Input](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/input.md), [Select](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/select.md), [Switch](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/switch.md), [Tabs](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/tabs.md), [Badge](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/badge.md), [Card](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/card.md), [Empty State](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/empty-state.md), [Skeleton](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/skeleton.md), [Button](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/button.md)
- How: Build the grid from `card` tiles: `input` for search (filter your own data; `search-list` takes plain strings only), `select` for sort, `tabs` or `badge` buttons for category chips, `switch` for in stock only, `skeleton` while loading, `empty-state` (with `live`) for no results and a Clear filters action that keeps the other filters.
- Missing: `catalog` is not for retail products. Every item requires `host`, an ISO `date` (rendered as a date block on each card, and `sort=date` uses it), `capacity` and `remaining` (rendered as 'n of capacity places left' and 'Selling fast'), and it has no brand, variant, rating or compare-at price field and no multi-facet filters (size, color). Use it only for the classes and events in the bookable-things need below.

### Sell bookable things: classes, tours, workshops, tickets

- Fit: **Ready**
- Use: [Catalog](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/catalog.md), [Detail Page](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/detail-page.md), [Checkout](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/checkout.md), [Order Confirmation](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/order-confirmation.md), [Ticket Pass](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/ticket-pass.md)
- How: This is what the blocks are built for. `catalog` (search, category chips, sort, price buckets, availability switch, grid or compact list, ISO `currency`) lists items shaped title, host, location, category, date, price, capacity, remaining. `detail-page` shows media, key facts, About, Schedule and FAQ tabs, tiers with quantity, running total, checkout and waitlist (`onWaitlist`, relabel to Notify me via `labels`). `checkout` takes `items`, `fees`, `currency`, `discountCodes` and an async `onPay` that gets masked card data (last four only). `order-confirmation` and `ticket-pass` give the receipt and QR passes. Map `DetailCheckout` ({tierId, quantity}) to `CheckoutItem`s yourself.

### Product detail with variants and purchase panel

- Fit: **Gap**
- Use: [Tabs](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/tabs.md), [Accordion](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/accordion.md), [Radio Group](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/radio-group.md), [Quantity Stepper](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/quantity-stepper.md), [Badge](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/badge.md), [Progress](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/progress.md), [Button](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/button.md), [Stat](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/stat.md)
- How: Compose: `tabs` or `accordion` for description, specs, shipping and returns; `radio-group` styled as size chips or swatches for variants (disable out-of-stock options); `quantity-stepper` with `max` set to stock; a `badge` for In stock or Sold out; `progress` with `tone="auto"` and `invert` (the value is what remains) for a low-stock bar, noting that `invert` does nothing unless `tone="auto"` (the default tone is brand); a primary `button` plus a Notify me action when sold out.
- Missing: `detail-page` is an event-ticket page, not a product page: it requires `date` and a `host`, its options are 'tiers' with seats `capacity` and `remaining`, and its tabs are About, Schedule and FAQ. It has no image gallery or zoom, no color swatches, and no rating or review list. No opendraft component is a gallery either: build a thumbnail row and main image yourself.

### Ratings and reviews

- Fit: **Gap**
- Use: [Progress](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/progress.md), [Avatar](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/avatar.md), [Badge](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/badge.md), [Accordion](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/accordion.md), [Button](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/button.md), [Textarea](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/textarea.md)
- How: No rating, star or review component ships. Draw stars from lucide `Star` icons inside an element with an `aria-label` such as '4.6 out of 5, 128 reviews' (keep a text value, not icons alone). A rating distribution is a stack of `progress` rows (`label` '5 stars', `valueLabel` the count); reviews are your own list with `avatar`, a 'Verified purchase' `badge` only when you can verify it, and `accordion` for long text; a review form uses `textarea` and `button`.
- Missing: No star input, rating summary or review list component; show only reviews you can verify.

### Shopping cart and mini-cart

- Fit: **Adapt**
- Use: [Drawer](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/drawer.md), [Quantity Stepper](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/quantity-stepper.md), [Button](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/button.md), [Badge](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/badge.md), [Empty State](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/empty-state.md), [Alert](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/alert.md), [Separator](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/separator.md), [Toast](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/sonner.md)
- How: A cart in a `drawer` (side sheet, closes on Esc or backdrop; you supply the header, since it has no title slot) with `quantity-stepper` lines (`max` = stock), a subtotal and a checkout `button`; `empty-state` when empty; `alert` when a price or availability changed; `sonner` for 'added to cart' feedback.
- Missing: No cart component: build the line list yourself and persist the cart on your backend. `checkout` has a quantity-stepper order summary but only inside its ticket flow.

### Checkout (guest or account) and payment for physical goods

- Fit: **Gap**
- Use: [Stepper](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/stepper.md), [Field](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/field.md), [Input](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/input.md), [Select](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/select.md), [Radio Group](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/radio-group.md), [Checkbox](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/checkbox.md), [Quantity Stepper](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/quantity-stepper.md), [Alert](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/alert.md), [Button](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/button.md)
- How: Build with `stepper` (shipping, delivery, payment, review; steps take a `description`), `field` with `FieldGroup` for the address (use `select` for country), `radio-group` for shipping methods (price and arrival date in each option), `checkbox` for billing same as shipping, an order summary list with totals, a discount code `input`, and your payment provider's hosted fields and wallet buttons.
- Missing: The `checkout` block cannot do this: its details step is Full name, Email, Phone and an 'I'm booking for someone else' attendee, then a delivery choice of 'Digital pass by email' or 'Collect at the front desk' (hard-coded, not in `labels`), payment is card or 'Pay later (within 3 days)', and the confirmation step prints a QR ticket pass per item. There is no shipping address form, shipping-method picker, billing address or wallet-button slot. Its `fees` list adds flat extra charges only, so shipping rates and tax need your own summary.

### Order confirmation and tracking

- Fit: **Adapt**
- Use: [Timeline](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/timeline.md), [Stepper](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/stepper.md), [Copy Button](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/copy-button.md), [Badge](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/badge.md), [Stat](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/stat.md), [Alert](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/alert.md), [Page Header](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/page-header.md), [Button](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/button.md)
- How: `timeline` is a ready tracking view: statuses success, current and upcoming for Placed, Packed, Shipped and Delivered, `timestamp` and `time`, `meta` for the carrier or location, expandable detail for scan events, and a loading state. `stepper` (steps accept `description` for an estimated date) for the coarse stages; `copy-button` for the tracking number; `alert` for a delay. Order totals in `stat`s and your own line list.
- Missing: `order-confirmation` is ticket-shaped: it always prints 'A confirmation was sent to' with the email, a Tickets stat, a 'Your tickets' section with a QR pass per ticket (an empty list leaves a bare heading), a priced line list, and a stepper that is always fully completed (Details, Payment, Confirmation), with no shipping status. Use it only for tickets and bookings.

### Returns and refunds

- Fit: **Adapt**
- Use: [Stepper](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/stepper.md), [Radio Group](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/radio-group.md), [Checkbox](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/checkbox.md), [Textarea](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/textarea.md), [Select](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/select.md), [Dropzone](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/dropzone.md), [Alert](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/alert.md), [Field](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/field.md), [Button](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/button.md)
- How: A `stepper` flow: choose items (`checkbox`), reason (`select`), notes (`textarea`), photos with `dropzone` (`accept`, `maxFiles`, `capture`), then refund or exchange (`radio-group`) and a review step; show the return deadline in an `alert`.
- Missing: No printable return-label view; render it from your carrier's PDF.

### Seller dashboard: sales and performance

- Fit: **Adapt**
- Use: [Analytics Dashboard](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/analytics-dashboard.md), [Page Header](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/page-header.md), [Stat](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/stat.md)
- How: Relabel `analytics-dashboard` for revenue, orders and conversion: metrics have `Intl` `format` and a delta vs the previous period, there is a single-series line chart with hover tooltip and metric tabs, a sortable table (name, visitors, conversion 0-1, and a custom `valueColumn` for revenue; `formatVisitors` and `formatConversion` change the other cells), and a stacked share bar in `channels`.
- Missing: The range tabs are fixed to 7d, 30d and 90d (only their text can change) and are not driven by `date-range-picker`; the chart is one series with no comparison overlay; table columns are page-analytics shaped; only one stacked bar for breakdowns, no donut.

### Seller order and inventory management

- Fit: **Adapt**
- Use: [Data Table](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/table.md), [Tabs](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/tabs.md), [Badge](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/badge.md), [Input](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/input.md), [Select](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/select.md), [Button](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/button.md), [Progress](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/progress.md)
- How: `table` with `selectable`, `onSelectionChange` (ids) and `getRowId`, sorting, a fixed `rowHeight`, and a status `badge` in a `cell`; `tabs` for New, To ship and Returns (each filters the rows you pass); when ids are selected show your own bulk bar of `button`s (Print labels, Mark shipped). A `progress` bar in a stock cell with `tone="auto"` and `invert`.
- Missing: No built-in bulk-action bar or filter chips: `selection-actions` is an AI text-rewrite bar, `filter-table` is a demo task table (task, date, status todo/progress/done, owner) and `records-table` is a demo record grid (name, tags, strength), so none of them fits orders. Columns scroll sideways on phones.

### Create and edit a product listing

- Fit: **Adapt**
- Use: [Field](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/field.md), [Input](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/input.md), [Textarea](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/textarea.md), [Select](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/select.md), [Repeater Field](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/repeater-field.md), [Dropzone](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/dropzone.md), [Switch](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/switch.md), [Stepper](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/stepper.md), [Tabs](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/tabs.md)
- How: `field` and `FieldGroup`, `repeater-field` for variants and prices (rows built in `renderRow`), `dropzone` for photos (`multiple`, `accept`, `maxFiles`, file list with progress and `onRemove`), `switch` for published, `stepper` to split a long form.
- Missing: No rich text editor for descriptions and no image reordering or cropping.

### Promotions and discount codes

- Fit: **Ready**
- Use: [Data Table](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/table.md), [Dialog](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/dialog.md), [Field](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/field.md), [Input](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/input.md), [Date Range Picker](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/date-range-picker.md), [Switch](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/switch.md), [Badge](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/badge.md), [Button](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/button.md)
- How: A `table` of codes (sortable, status `badge`), a `dialog` with a `field` form to create one, `date-range-picker` for the validity window and `switch` to enable it.

## Libraries and services that pair well

- Commerce backend and product data: Shopify Storefront API, Medusa, commercetools. Map products, carts and orders to your own `card`, `table` and `timeline` data in an adapter; map to the props of `catalog`, `detail-page` and `checkout` only for dated, seat-limited items. Keep the cart on the server so it persists across devices.
- Payments, wallets and tax: Stripe, Adyen, PayPal. Mount the provider's hosted card fields and wallet buttons inside your own payment step; send your backend a token only. Tax should come from the provider so the total shown is the total charged.
- Product search and filtering: Algolia, Typesense, Meilisearch. Drive your own `input`, `select` and chip controls from the search results; faceted filters such as size and color are not built in. For event-style items, results can feed `catalog` through its `items` prop.
- Shipping rates and tracking: Shippo, EasyPost, AfterShip. Show their rates as `radio-group` options in your checkout and their tracking events in a `timeline`.
- Reviews and ratings: Yotpo, Judge.me, Trustpilot. No rating or review component ships; draw stars from icons with a text value and count, and avoid displaying reviews you cannot verify.

## Typical screens

- **Shop and category**: [Site Header](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/site-header.md) + [Input](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/input.md) + [Select](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/select.md) + [Tabs](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/tabs.md) + [Switch](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/switch.md) + [Card](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/card.md) + [Badge](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/badge.md) + [Skeleton](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/skeleton.md) + [Empty State](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/empty-state.md)
- **Product page**: [Site Header](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/site-header.md) + [Tabs](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/tabs.md) + [Accordion](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/accordion.md) + [Radio Group](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/radio-group.md) + [Quantity Stepper](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/quantity-stepper.md) + [Badge](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/badge.md) + [Progress](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/progress.md) + [Button](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/button.md)
- **Cart**: [Drawer](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/drawer.md) + [Quantity Stepper](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/quantity-stepper.md) + [Button](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/button.md) + [Separator](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/separator.md) + [Empty State](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/empty-state.md) + [Alert](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/alert.md)
- **Checkout**: [Site Header](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/site-header.md) + [Stepper](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/stepper.md) + [Field](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/field.md) + [Input](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/input.md) + [Select](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/select.md) + [Radio Group](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/radio-group.md) + [Checkbox](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/checkbox.md) + [Alert](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/alert.md) + [Button](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/button.md)
- **Order status**: [Page Header](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/page-header.md) + [Stat](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/stat.md) + [Timeline](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/timeline.md) + [Copy Button](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/copy-button.md) + [Badge](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/badge.md) + [Button](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/button.md)
- **Book a class or event**: [Site Header](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/site-header.md) + [Catalog](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/catalog.md) + [Detail Page](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/detail-page.md) + [Checkout](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/checkout.md) + [Order Confirmation](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/order-confirmation.md)
- **Seller orders**: [Page Header](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/page-header.md) + [Tabs](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/tabs.md) + [Input](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/input.md) + [Data Table](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/table.md) + [Badge](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/badge.md) + [Button](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/button.md)
- **Seller overview**: [Page Header](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/page-header.md) + [Analytics Dashboard](https://raw.githubusercontent.com/nuelmdesign/UI-System/HEAD/public/llms/analytics-dashboard.md)

## Install the starter kit

One command installs the theme and the components this playbook uses:

```bash
npx shadcn@latest add @opendraft/kit-ecommerce
```

## Known gaps

- Browse, search and filter products: `catalog` is not for retail products. Every item requires `host`, an ISO `date` (rendered as a date block on each card, and `sort=date` uses it), `capacity` and `remaining` (rendered as 'n of capacity places left' and 'Selling fast'), and it has no brand, variant, rating or compare-at price field and no multi-facet filters (size, color). Use it only for the classes and events in the bookable-things need below.
- Product detail with variants and purchase panel: `detail-page` is an event-ticket page, not a product page: it requires `date` and a `host`, its options are 'tiers' with seats `capacity` and `remaining`, and its tabs are About, Schedule and FAQ. It has no image gallery or zoom, no color swatches, and no rating or review list. No opendraft component is a gallery either: build a thumbnail row and main image yourself.
- Ratings and reviews: No star input, rating summary or review list component; show only reviews you can verify.
- Shopping cart and mini-cart: No cart component: build the line list yourself and persist the cart on your backend. `checkout` has a quantity-stepper order summary but only inside its ticket flow.
- Checkout (guest or account) and payment for physical goods: The `checkout` block cannot do this: its details step is Full name, Email, Phone and an 'I'm booking for someone else' attendee, then a delivery choice of 'Digital pass by email' or 'Collect at the front desk' (hard-coded, not in `labels`), payment is card or 'Pay later (within 3 days)', and the confirmation step prints a QR ticket pass per item. There is no shipping address form, shipping-method picker, billing address or wallet-button slot. Its `fees` list adds flat extra charges only, so shipping rates and tax need your own summary.
- Order confirmation and tracking: `order-confirmation` is ticket-shaped: it always prints 'A confirmation was sent to' with the email, a Tickets stat, a 'Your tickets' section with a QR pass per ticket (an empty list leaves a bare heading), a priced line list, and a stepper that is always fully completed (Details, Payment, Confirmation), with no shipping status. Use it only for tickets and bookings.
- Returns and refunds: No printable return-label view; render it from your carrier's PDF.
- Seller dashboard: sales and performance: The range tabs are fixed to 7d, 30d and 90d (only their text can change) and are not driven by `date-range-picker`; the chart is one series with no comparison overlay; table columns are page-analytics shaped; only one stacked bar for breakdowns, no donut.
- Seller order and inventory management: No built-in bulk-action bar or filter chips: `selection-actions` is an AI text-rewrite bar, `filter-table` is a demo task table (task, date, status todo/progress/done, owner) and `records-table` is a demo record grid (name, tags, strength), so none of them fits orders. Columns scroll sideways on phones.
- Create and edit a product listing: No rich text editor for descriptions and no image reordering or cropping.

Docs: https://ui-system-virid.vercel.app/docs/use-cases
