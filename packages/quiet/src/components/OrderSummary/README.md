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

- **Lines:** a 56px image (4:5) with the quantity on its corner from 2 up, the name and the variant ("Blue · M"), and the line's price — a sale shows the original struck through, like Price.
- **Totals:** Subtotal (summed from the lines unless you pass `subtotal`), your rows, then **Total** in price size. A negative amount is a discount (`−8,30 €` in `success`); `0` reads "Free"; no amount shows your `note` ("Chosen in the next step").
- `:title="null"` drops its own heading — for inside a Card that already has one (the back office's order page).
- The default slot sits between the lines and the totals — that's where DiscountCode goes.
- **Folding:** `collapsible="auto"` folds it under 900px of viewport into one row — "Show order summary ⌄ · 84,60 €" — a disclosure button (`aria-expanded`), so the form comes first on a phone but the total is always in view. `true` always folds, `false` (default) never. Bind `v-model:open` to control it, or pass `default-open`.
- `tax-note` ("Including 16,96 € VAT (19 %)") sits under the total; the `#tax-note` slot takes your own text with a link.
- Screen readers hear each line's quantity ("Quantity 2"); the picture is decorative unless you give it `alt`.

## Layout

It brings no panel of its own: in checkout put it on `surface-sunken` beside the form (sticky); on the confirmation page in a bordered panel.

## Keyboard and screen readers

Each line is read with its quantity ("Quantity 2"). Folded, the summary is a Disclosure: a button "Show order summary" with the total, `aria-expanded` as it opens.

## Built from

Price for each line, DescriptionList for the totals, Disclosure when folded, Icon.

## What you provide

All amounts are numbers in the shop currency (`configure({ currency })`); compute totals, tax and discounts in your app — this only shows them.
