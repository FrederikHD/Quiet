# Price

Shows an amount of money the same way everywhere — in product cards, on the product page, in the cart and in the back office — formatted for the shop's locale and currency.

```vue
<QPrice :amount="59" :compare-at="79" show-saving />
<QPrice :amount="99" size="large" tax-note />
<!-- product page -->
<QPrice :amount="29" from />
<!-- "from 29,00 €" when variants differ -->
<QPrice :amount="19.9" :unit-price="{ amount: 4.98, per: '100 ml' }" tax-note />
```

## How it looks

- **Regular:** the amount in `price` (17/24 semibold), `ink`. Prices are never `brand`.
- **On sale** (`compareAt` above `amount`): the new price in `sale`, the original after it in `small` `ink-muted`, struck through. `showSaving` adds a `sale` badge ("−25%").
- **Sizes:** `small` (15/22) in cards, lists and the cart; `default` (17/24); `large` (`price-lg`, 28/32) on the product page.
- **`from`:** "from 29,00 €" when the variants have different prices.
- **`unitPrice`:** the price per unit, required in Germany for goods sold by quantity, weight or volume ("4,98 € / 100 ml").
- **`taxNote`:** "incl. VAT, plus shipping" under the price — `true` for the configured text, or your own text. For a link to the shipping costs, use the `#tax-note` slot:

```vue
<QPrice :amount="99">
  <template #tax-note>incl. VAT, plus <a href="/shipping">shipping</a></template>
</QPrice>
```

## Keyboard and screen readers

Nothing to operate except a link in the tax note. A strikethrough isn't announced, so a sale price reads "Sale price 59,00 € Original price 79,00 €" from visually hidden words, and the badge reads "25% off" instead of "−25%".

## Formatting

Numbers and the currency sign follow `configure({ locale: 'de-DE', currency: 'EUR' })`: "59,00 €" in German, "€59.00" in English. Pass `currency` for a single price in another currency.

## What you provide

- **Required:** `amount` (a number, not a string).
- **Optional:** `compareAt` (the original price; above `amount` it shows as a sale), `showSaving`, `size` (`small` | `default` | `large`; default `default`), `from`, `unitPrice` (`{ amount, per }`), `taxNote` (`true` or your own text), `currency` (ISO code; default from `configure({ currency })`).
- **Slots:** `#tax-note` (your own tax note, e.g. with a link).
- **Translations:** `strings`, or once for the shop with `configure({ strings: { price: … } })`: `salePrice` ("Sale price"), `originalPrice` ("Original price"), `from` ("from"), `perUnit(amount, unit)` ("4,98 € / 100 ml"), `taxNote` ("incl. VAT, plus shipping"), `saving(pct)` ("−25%"), `savingLabel(pct)` ("25% off", read out for the badge).
