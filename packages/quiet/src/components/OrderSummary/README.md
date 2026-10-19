# OrderSummary

What's being bought and what it costs. Beside the checkout form, on the order confirmation, and in the back office's order view.

```vue
<QOrderSummary
  :items="[{ name: 'Linen shirt', variant: 'Blue · M', quantity: 2, price: 118, image: { src: shirt } }]"
  :totals="[
    { label: 'Discount', detail: 'LINEN10', amount: -11.8 },
    { label: 'Shipping', amount: null, note: 'Chosen in the next step' },
  ]"
  :total="106.2"
  tax-note="Including 16,96 € VAT (19 %)"
  collapsible="auto"
>
  <QDiscountCode … />
</QOrderSummary>
```

## Behaviour

- **Heading:** "Order summary" (or `title`) as an `h2` (`headingLevel`), with the item count ("3 items") beside it. `:title="null"` drops it — for inside a Card that already has one (the back office's order page).
- **Lines:** a 56px image (4:5) with the quantity on its corner from 2 up (`show-quantity="always"`: on every line), the name (a link with `href`) and the variant ("Blue · M"), and the line's price — a sale (`compareAt`) shows the original struck through, like Price.
- **Totals:** Subtotal (summed from the lines unless you pass `subtotal`), your `totals` rows (`{ label, detail, amount, note, free }`), then **Total** in 20/28 semibold. A negative amount is a discount (`−8,30 €` in `success`); `0` reads "Free" (unless `free: false`); no amount shows your `note` ("Chosen in the next step"), or "—".
- The default slot sits between the lines and the totals — that's where DiscountCode goes.
- **Folding:** `collapsible="auto"` folds it below `collapseBelow` (default 900px) of viewport into one row — "⌄ Show order summary · 84,60 €", a Disclosure — so the form comes first on a phone but the total is always in view. Open, it reads "Hide order summary". `true` always folds, `false` (default) never. Bind `v-model:open` to control it, or pass `defaultOpen`.
- `taxNote` ("Including 16,96 € VAT (19 %)") sits under the total; the `#tax-note` slot takes your own text with a link.

## Layout

It brings no panel of its own: in checkout put it on `surface-sunken` beside the form (sticky); on the confirmation page in a bordered panel.

## Keyboard and screen readers

- It's a `section` named by its heading. Folded, it's a `section` named by `aria-label` ("Order summary", or `title`). With `:title="null"` (unfolded) it's a plain `div` and the Card around it names it.
- The lines are a list. Each line reads its name, variant, "Quantity 2" (always, also for 1; the corner badge is hidden) and its price ("Sale price … Original price …" on sale). The picture is decorative unless you give it `alt`.
- The totals are a description list: each label is read with its amount.
- Folded, the summary is a Disclosure: a button "Show order summary" with the total, `aria-expanded` as it opens; Enter or Space toggles it. The button sits in a heading at `headingLevel`.
- Linked names are reached with Tab, then whatever you put in the default slot.

## Built from

Price for each line, DescriptionList for the totals, Disclosure when folded, Icon.

## What you provide

All amounts are numbers in the shop currency (`configure({ currency })`); compute totals, tax and discounts in your app — this only shows them.

- **Required:** `items` (`[{ id?, name, variant?, quantity?, price, compareAt?, image?, href? }]`; `price` is the line's total), `total`.
- **Optional:** `totals` (rows between Subtotal and Total: `[{ label, detail?, amount?, note?, free? }]`), `subtotal` (default: the sum of the lines), `taxNote`, `currency`, `collapsible` (`true` | `false` | `'auto'`; default false), `collapseBelow` (px of viewport; default 900), `defaultOpen`, `title` (default "Order summary"; `null` for none), `headingLevel` (2–6; default 2), `showQuantity` (`auto` | `always`; default `auto`).
- **v-model:** `v-model:open` (folded: open or not).
- **Events:** `@update:open(open)`.
- **Slots:** the default slot (between the lines and the totals: a DiscountCode), `#tax-note` (your own note under the total).
- **Translations:** `strings`, or once for the shop with `configure({ strings: { orderSummary: … } })`: `title` ("Order summary"), `show` ("Show order summary"), `hide` ("Hide order summary"), `subtotal` ("Subtotal"), `total` ("Total"), `free` ("Free"), `quantity(n)` ("Quantity 2"), `items(n)` ("3 items").
