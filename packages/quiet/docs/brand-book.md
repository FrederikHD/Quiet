A calm, neutral-first system for commerce: one set of tokens behind both the customer-facing storefront and the merchant back office. Warm off-white surfaces, near-black ink, and a single deep green that marks what matters — so products and data stay the loudest thing on screen.

## Principles

- **The product is the colour.** The storefront stays neutral so product photography carries the page. The back office stays neutral so statuses and numbers carry it.
- **Neutral first, one accent.** Almost everything is `surface`, `ink` and `line`. `brand` is reserved for the primary action, links, focus and selection — at most one `brand` button per view (Add to cart, Checkout, Save).
- **Borders, not shadows.** Elevation is a `surface-raised` fill plus a 1px `line` border. Dialogs and drawers sit on `overlay`.
- **Colour means something.** Status colours describe a state and always come with a word. `sale` only ever marks a price reduction; `danger` only ever marks an error or a destructive action.
- **One system, two densities.** Same palette and type; sizes switch between `comfortable` and `compact` (see Density).

## Themes

Two themes, `light` (default) and `dark`, built from the same token names — components never know which one is active.

- **Switching:** set `data-theme="light"` or `data-theme="dark"` on `<html>`. Native parts (scrollbars, autofill, date pickers) follow it.
- **Follow the system:** offer System / Light / Dark. Resolve System with `matchMedia('(prefers-color-scheme: dark)')`, listen for changes, and remember the person's choice. Set the attribute in a small inline script in `<head>`, before the page paints, so nobody sees a flash of the wrong theme.
- **Where:** the back office offers dark as a personal setting. The storefront ships light only, unless the brand decides otherwise — product photos shot on white turn into glaring boxes on a dark page.
- **In dark, fills get lighter.** `brand`, `danger` and `sale` are light pastels, so text on them is `on-solid`, which is near-black in dark. Hover and pressed go lighter, not darker. Never hard-code white or black — use `on-solid`, `ink`, `surface`.
- **Elevation:** `surface` is the darkest layer, `surface-raised` sits above it, and `surface-sunken` is the lightest grey, used for hover, headers and disabled fields. Floating panels keep their `line-strong` border.

## Density

Every component sizes itself from the density variables in Quiet's stylesheet (`styles/density.css`), never from `control-*` tokens directly. Set `data-density` on `<html>` or on any container; the nearest one wins.

| Variable                             | comfortable (default) | compact               |
| ------------------------------------ | --------------------- | --------------------- |
| `--ctl-h` control height             | `control-md` 40       | `control-sm` 32       |
| `--ctl-pad` control side padding     | `control-pad-md` 16   | `control-pad-sm` 12   |
| `--ctl-text` control text            | `control-text-md` 15  | `control-text-sm` 13  |
| `--ctl-icon` icon in a control       | `icon-md` 20          | `icon-sm` 16          |
| `--ctl-gap` icon-to-label gap        | `space-2` 8           | `space-1` 4           |
| `--row-h` table row                  | `row-comfortable` 56  | `row-dense` 40        |
| `--cell-pad-x` / `--cell-pad-y`      | `space-4` / `space-3` | `space-3` / `space-2` |
| `--cell-text` table text             | 15                    | 13 (`table-text`)     |
| `--field-gap` between form fields    | `space-4` 16          | `space-3` 12          |
| `--panel-pad` card and panel padding | `space-6` 24          | `space-4` 16          |
| `--stack-gap` between stacked items  | `space-4` 16          | `space-2` 8           |

- **Storefront:** always `comfortable`. Primary actions (Add to cart, Checkout) use `control-lg`, `control-pad-lg` and `control-text-lg` directly, so they stay 48px whatever the density.
- **Back office:** `comfortable` by default for forms, settings and order detail; `compact` for lists and tables (orders, products, customers, inventory). Offer the person a Compact / Comfortable toggle that sets `data-density` on `<html>` and remember their choice.
- **Mobile:** below 640px, force `comfortable` — compact controls are too small to tap.
- **Thumbnails:** a table row that carries a product image uses `row-comfortable` even in compact.
- **Slim:** `control-slim` (28px) is a fixed size outside the density switch, for actions inside table cells and filter bars. Back office and desktop only; below 640px it takes the density size.
- Text in compact controls stays at 13px minimum; never shrink below `control-text-sm`.

## Conventions

Every component follows the same rules, so they look and behave alike next to each other.

**Sizes.**

- **`default`** follows the density: 40px comfortable, 32px compact.
- **`slim`** is a fixed 28px, desktop only (it grows back to the density size under 640px). Use it for filter bars, table toolbars, rows and pagination.
- **`large`** is a fixed 48px, for the storefront.
- The same three sizes apply to Button, Input, Select and Combobox. Checkbox and Radio rows, table rows and list options follow the density.
- Controls also take `size` as `slim · default · large` (QuantityStepper and SearchBox: `default · large`). Things you read rather than operate — Price, Rating, Metric, EmptyState — size as `small · default · large` instead, because they're type sizes, not control heights.

**Common props.** Every component takes `class` and `style` (on its outer element). Every component with built-in words takes `strings` for them, which can also be set once for the whole shop with `configure({ strings })`. Headings inside a component are `h2`–`h6` via `headingLevel`. A field-like component takes `label`, `labelHidden`, `required`, `hint`, `error`, `disabled` and `id`, and holds its value in `v-model`. Things that open take `v-model:open` (Dialog also emits `@close`).

**Built from each other.** Bigger components are made of the smaller ones, never re-drawn: a search box is an Input, a folded order summary a Disclosure, a price filter two Fields, every removable chip a Tag. Each component's page lists what it's built from.

**Shape.**

- **`radius-md`:** controls and choice cards.
- **`radius-lg`:** containers (Dialog, Table, Card).
- **`radius-sm`:** small boxes (checkbox, the tag inside a field).
- **`radius-full`:** pills (Badge, Tag, radio).
- **Borders:** edges people interact with use `line-strong` (3:1); containers and rules between rows use `line`.

**States.** Each state looks the same everywhere.

| State     | Look                                                                                                                                                                                                                                                                                                         |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Hover     | Fields and boxes: border `ink-muted`. Buttons, rows and options: `surface-sunken` fill. Only where a pointer can hover.                                                                                                                                                                                      |
| Selected  | `brand-tint` fill: pressed toggles, table rows, chosen cards (plus a `brand` border). Ticked boxes are `brand`.                                                                                                                                                                                              |
| Focus     | 2px `brand` ring, 2px outside; 1px outside for small buttons inside another control (clear ×, chip ×, sort). Fields show focus on their border instead. Menu items and tabs show it as a 2px inset ring, and a toast's buttons use a `surface`-coloured ring on the dark bar. Keyboard only, never on click. |
| Invalid   | `danger` border; the focus ring turns `danger` too. The message comes from the field or group.                                                                                                                                                                                                               |
| Disabled  | `surface-sunken` fill, `line` border, `ink-muted` text, not-allowed cursor.                                                                                                                                                                                                                                  |
| Read-only | `surface-sunken` fill, `line` border, `ink` text, no chevron. Input and Select show it this way, and so does Combobox.                                                                                                                                                                                       |

**Type.**

- **Control text:** `--ctl-text`.
- **Labels, table headers and badges:** 13/16 medium.
- **Descriptions, hints and messages:** 13/18.
- **Titles** (Card, Dialog, FormSection, table caption): 17/24 semibold. The page title (one `h1` per Page) is 22/28 semibold.
- **`meta`** (prices and counts in options and choice rows): control size, medium, `ink`, tabular figures.
- **Icons beside text:** an icon in front of text (buttons, menus, nav, tabs, badges, messages, toasts), and the box of a checkbox or radio, sits on the middle of the capital letters of the text's first line. It's measured from the font itself (`cap`), so it holds on every device. An icon alone in a button is centred in the button.
- **Room for accents and descenders:** text that's clipped for an ellipsis (button labels, chips, badges, combobox values) keeps a line height of at least 1.2, so Ä, Ö, g and y stay whole.

**Props.**

- **Values:** `v-model` everywhere — Input, Select and Textarea hold a string, Checkbox a boolean, CheckboxGroup an array, RadioGroup and Combobox the chosen value. Leave `v-model` out and the component keeps its own state (start it with `defaultValue` where offered). Other values have named models: `v-model:sort`, `v-model:selected`, `v-model:page`, `v-model:open`.
- **Errors:** controls take `invalid`; fields and groups take `error` / `warning` / `success` and pass it on to their controls.
- **Hidden labels:** `labelHidden` (Field, groups, Checkbox) and `captionHidden` (Table) keep the label for screen readers only.
- **Disabled and read-only:** `disabled` and `readonly` on a field or group reach every control inside.
- **Ids:** a field's `id` lands on its control, and a group's on its first option or control. Error-summary links use it.
- **Rich content:** short text goes in props (`title`, `hint`); anything richer goes in a slot of the same name (`#title`, `#hint`, `#actions`, `#footer`).
- **Refs and classes:** `class` and `style` go on the outer box (on overlays, the panel; on a Menu without a trigger of your own, its ⋯ button). Form controls expose `focus()` and their native element on a template ref (Input `input`, Select `select`, Textarea `textarea`, Checkbox, Radio and QuantityStepper `input`); Combobox exposes `focus()`, `open()` and `close()`, Dialog `close()` and its `panel`, Popover `show()`, `hide()` and `toggle()`, FileUpload `focus()` and `add(files)`.

**Translations and numbers.**

- Call `configure({ locale: 'de-DE', strings: { form, combobox, table, pagination, shell, tabs, input: { clear }, dialog: { close } } })` once — or pass the same options to `app.use(Quiet, { … })`. Components follow later changes too.
- Numbers then follow the locale: "1.240".
- A component's own `strings` (or `clearLabel` / `closeLabel`) still wins.

**Phones.**

- **Control sizes and overlays** switch on the screen width (640px): slim grows, text goes to 16px, dialogs become sheets. The AppShell nav becomes a drawer under 1024px.
- **Layouts** switch on their own width, so they work in any column:
  - Field puts labels beside at 400 / 520px.
  - FieldGroup stacks by measuring its own width.
  - FormActions stacks under 480px; a sticky bar stays one row.
  - Table switches to cards under 640px (`cardsBelow` moves it for a table of a few columns).
  - Pagination drops its extras step by step under 560, 460, 400 and 280px.
  - Tabs scroll sideways when they don't fit, never wrap.
  - Page puts its side column beside the main one from 900px.

**Sticky bars.**

- The phone top bar and a sticky FormActions bar set the page's scroll padding, so a field reached with Tab scrolls clear of them rather than hiding underneath.
- Toasts appear at the top, under the phone top bar, so they never cover a sticky Save bar.
- In a scrolling table, the pinned column and sticky header do the same inside the table.

**Print.**

- Printing gives the content only, always in the light theme's colours: navigation, toasts, page and form actions, table toolbars and row controls are left out, all tab panels print, and cards don't split across pages.

## Voice

Plain, short, sentence case. Buttons are verbs: "Add to cart", "Save changes", "Refund order" — never "OK" or "Submit". Errors say what happened and what to do next: "Card declined — try another payment method." Storefront copy may be warm; back-office copy is strictly functional.

## Product titles

A product's title is its name in the shop, in the customer's words. It's the same everywhere the product appears: the card, the product page's `h1`, search suggestions, the cart, the order summary, and the order and product screens in the back office.

- **Say what it is:** the type, with the word that sets it apart from its neighbours. "Linen shirt", "Relaxed linen trousers", "Heavy linen jacket". Not "Shirt LS-2041", and not "Premium ultra-soft summer linen shirt".
- **Sentence case:** only the first word and names capitalised. No ALL CAPS, no emoji, no symbols.
- **Short:** aim for 40 characters or fewer, so a phone card shows it in two lines and the cart line doesn't wrap. Cards show the whole title; nothing cuts it off, so a long one makes the grid uneven.
- **Options aren't in the title:** colour and size are the variant, shown under the title as "Navy · M" in the cart, the order summary and the back office, and as choices on the product page. If each colour is its own product, add it after a comma in lower case: "Linen shirt, navy".
- **No marketing in the title:** "new", "sale", "bestseller", "free shipping" are Badges or Prices, which change; the title doesn't.
- **The brand:** in a shop that sells one brand, leave it out. A shop of several brands shows it as the card's `vendor` line above the title, not in it.
- **Searchable words:** the words people search for belong in the title only when they're true to the product ("linen", "shirt"). Everything else goes in the description, where search finds it too.
- **Translated, not transliterated:** in a German shop, "Leinenhemd", not "Linen shirt". Keep the article number (SKU) out of it: it is the back office's subtitle ("SKU LS-2041").

## Visual foundations

- **Type:** Inter throughout (Google Fonts, system-ui fallback). `body` 15/22 is the default. Weights 400 and 600, plus 500 for `label`.
- **Numbers:** prices, quantities, order totals and every table column of numbers use `font-variant-numeric: tabular-nums` and are right-aligned in tables. Prices are `ink`, never `brand`.
- **Colour:** text is `ink` on `surface`/`surface-raised`/`surface-sunken`; secondary text `ink-muted`. Control borders use `line-strong` (3:1); `line` is for decorative dividers only. Every text pair passes 4.5:1 and every border, focus ring and icon 3:1, in both themes.
- **Spacing:** a 4px base — 4, 8, 12, 16, 24, 32, 64.
- **Radius:** `radius-sm` 4 small controls, `radius-md` 8 buttons, inputs and product images, `radius-lg` 16 cards and drawers, `radius-full` badges and tags.
- **Focus:** buttons, links and other clickable things get a 2px `brand` ring with a 2px offset. Text fields show focus on their border instead: 1px → 2px, drawn inward, in the field's state colour — `brand` normally, `danger` while the field has an error, so an error never disappears while it's being fixed.

## Forms

- Build every form from Form, FormSection, Field, FieldGroup and FormActions; never hand-roll a label and an input.
- Labels: `auto` placement by default — beside the control from 520px, above it below that. `side` falls back to above under 400px; nothing puts a label beside a control on a phone. The storefront checkout always uses `top`.
- Side-by-side fields (FieldGroup) stack by themselves once their narrowest field would be under 100px.
- Parts of one value (Prefix | Next number, Country code | Phone) use a `connected` FieldGroup: one joined control, split with `columns`.
- Short, self-contained tasks that block what comes next (confirm a deletion, edit an address) open in a Dialog: `sm` for confirmations, sheets on phones. Anything long or multi-step is a page.
- One choice from a short known list is a Select (native, so phones use their own picker); 2–5 options people should compare are a RadioGroup (as `cards` when each option carries a price or a description, like delivery and payment); long lists people search, lists fetched from the server, and picking several values are a Combobox, whose status line always says whether the list shown is complete.
- Several independent yes/no choices are a CheckboxGroup. A single checkbox states what ticking it does ("Send me the newsletter") and takes effect on save, never instantly — instant on/off belongs to a switch.
- Longer text is a Textarea (`autoGrow` for descriptions and notes); files and images are added with FileUpload, whose limits are repeated in the hint.
- Every control has a visible label. Help that is nice to know goes in a `help` tip; anything needed to answer goes in the visible `hint`.
- Mark required fields with `danger` asterisks in the back office; mark optional fields "(optional)" in checkout and sign-up.
- Errors say what's wrong and how to fix it, appear under the control in `danger` with an icon, and are listed in the error summary after a failed submit. Warnings (`warning`) never block saving.
- Size a field to its expected answer (`width`): short for postcodes and prices, full for titles and addresses.

## Status badges

The Badge component: pill (`radius-full`), `label` type, tint background with the matching strong text, padding `space-1` × `space-2`. One mapping for orders, payments, fulfilment and stock — use it everywhere:

| State   | Tokens                          | Examples                                            |
| ------- | ------------------------------- | --------------------------------------------------- |
| Success | `success` on `success-tint`     | Paid, Fulfilled, Delivered, In stock, Active        |
| Warning | `warning` on `warning-tint`     | Pending, Unfulfilled, Low stock, Partially refunded |
| Info    | `info` on `info-tint`           | Processing, Shipped, In transit, Pre-order          |
| Danger  | `danger` on `danger-tint`       | Payment failed, Cancelled, Out of stock             |
| Neutral | `ink-muted` on `surface-sunken` | Draft, Archived, Refunded                           |

## Back office

- **Layout:** AppShell — a fixed left Nav on `surface-raised` with a `line` border (a drawer below 1024px); each screen is a Page on `surface` with `space-8` gutters (one `h1`, actions on the title line, an optional 2 : 1 side column); related content sits in Cards with `--panel-pad` padding. Tables sit straight on the page — they are their own card.
- **Tables:** always the Table component — `surface-raised` with a `line` border and `radius-lg`; header row `surface-sunken` in `label`; body rows `--row-h` tall with `--cell-pad-x`/`--cell-pad-y` padding and `--cell-text` text, `line` rules between rows. Rows with a thumbnail use `row-comfortable` and a 32px image at `radius-sm`. Selected rows take `brand-tint`. Search and filters sit in the table's toolbar as slim controls; Pagination goes in its footer; statuses are Badges. Lists people work through on a phone (orders) use `mobile="cards"`; the rest scroll sideways with the first column pinned.
- **Controls:** sized by the density variables; list screens set `data-density="compact"`, forms stay `comfortable`.
- **Feedback:** the result of an action shows as a Toast ("Product saved", with Undo where it can be undone); anything people must fix stays in the form; a state that stays true (payment pending, products out of stock) is a Notice at the top of the page. An empty table or list shows an EmptyState (`small`) that says why and what to do. Secondary actions on a row or page go in a Menu ("⋯"); destructive ones last, confirmed in a Dialog.
- **Details:** read-only facts (a customer's contact data, payment) are a DescriptionList in a Card; an order's items and totals are the same OrderSummary the shop shows, inside a Card (`:title="null"`).
- **Views:** saved filters over a list (All · Unfulfilled 8 · Unpaid) and sections of a long form are Tabs; period switches on metrics are segmented Tabs.
- **Metrics:** KPI cards are a Metric in a Card: the figure in `metric`, the label in `small` `ink-muted`, the change in `success`/`danger` with an arrow and words, never colour alone.
- **Money:** always `money()` — in the shop's format in both apps ("1.234,50 €" for a German shop), so a price reads the same to the merchant and the customer.

## Storefront

- **Layout:** `surface` ground, `space-16` between sections, max content width 1280px. Pages: Home (hero on `surface-sunken`, collection tiles, best rated, new in, customer quotes, perks), collections, search results, product pages, checkout, confirmation, information pages (720px reading width, FAQs as Disclosures) and a not-found page (EmptyState with a way back).
- **Product cards:** image on `surface-sunken` at `radius-md` (4:5 portrait or 1:1, consistent per catalogue), then name in `body`, price in `price`. No border; the image is the card.
- **Prices:** regular price in `price` `ink`. On sale: the new price in `sale`, the original after it in `small` `ink-muted` struck through. A Sale badge is a `sale` pill with white text.
- **Product page:** price in `price-lg`; Add to cart is a full-width `brand` button at `control-lg`.
- **Ratings:** stars in `rating`, the number and review count in `small` `ink`.
- **Mobile:** every tap target at least `control-lg` (48px); cart opens as a sheet on `overlay`.
- **Product page parts:** Gallery for images, RadioGroup `swatches` for colour and `buttons` for size (sold out crossed through but choosable, so "Notify me" can follow), QuantityStepper beside Add to cart, Breadcrumbs above the title.
- **Checkout:** Steps above the title (Address → Shipping → Payment; done steps link back, later ones can't be skipped to). The form on `surface`, the OrderSummary beside it on `surface-sunken`, sticky; under 900px the summary folds into one "Show order summary · total" row above the form. Addresses with AddressFields; delivery and payment as RadioGroup `cards`; a DiscountCode inside the summary. Labels on `top`, optional fields marked "(optional)". The final button names the obligation to pay and the amount: "Buy now · 84,60 €".
- **Browsing:** filters beside the grid from 900px (Disclosures: Colour as swatches, Size as tiles, Price as a PriceRange, Availability), in a "Filter (2)" sheet on phones with "Show 12 products" at the bottom. The filters in use as FilterChips above the results; the count, then sort. Filters and sort live in the URL. Show 12 products, then "Show more" with "Showing 12 of 40". Nothing left: an EmptyState that offers to clear the filters.
- **Search:** a SearchBox in the header (an icon that opens it full-screen on phones), suggesting collections and products as you type; Enter opens the results page, which filters like a collection.
- **Reviews:** a Rating under the product title links to the reviews. The section: ReviewSummary (bars filter by stars, "Write a review") beside the list on wide screens, above it on phones. The list is Review components, sorted by most recent (a Select offers most helpful, highest and lowest rated), three at a time with "Show more". Each review: stars, title, author, date and "Verified purchase" in `success`, what they bought, text that folds after five lines, the shop's reply, and a "Helpful" toggle.
- **Confirmation:** a `success` check, the order number, where the confirmation went, the details as a DescriptionList and the OrderSummary — no Steps.

## Iconography

Use only the Quiet icon set (the Icon component): 54 outline icons on a 20px grid with a 1.5px round stroke, never filled (rating stars are the one exception — see Rating). Size them with the icon tokens — `--ctl-icon` inside controls (`icon-md` 20 or `icon-sm` 16) and `icon-lg` 24 in the storefront header — and colour them `ink` or `ink-muted` through `currentColor`. The exception: icons in buttons that trigger an action or open a menu use `brand` (secondary and ghost Buttons; on solid buttons they take the label's colour). A status icon always sits next to its word. Help and explanations open from a `help` icon as a Popover tip, on click, never on hover.

## Logo

No logo yet — set the name in Inter 600 as plain type.
