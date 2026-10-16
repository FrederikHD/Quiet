# Price

Shows an amount of money the same way everywhere — in product cards, on the product page, in the cart and in the back office — formatted for the shop's locale and currency.

```vue
<QPrice :amount="59" :compare-at="79" show-saving />
<QPrice :amount="99" size="large" tax-note />            <!-- product page -->
<QPrice :amount="29" from />                             <!-- "from 29,00 €" when variants differ -->
<QPrice :amount="19.9" :unit-price="{ amount: 4.98, per: '100 ml' }" tax-note />
```

## How it looks

- **Regular:** the amount in `price` (17/24 semibold), `ink`. Prices are never `brand`.
- **On sale** (`compareAt` above `amount`): the new price in `sale`, the original after it in `small` `ink-muted`, struck through. `showSaving` adds a `sale` badge ("−25%").
- **Sizes:** `small` (15/22) in cards, lists and the cart; `default`; `large` (`price-lg`, 28/32) on the product page.
- **`from`:** "from 29,00 €" when the variants have different prices.
- **`unitPrice`:** the price per unit, required in Germany for goods sold by quantity, weight or volume ("4,98 € / 100 ml").
- **`taxNote`:** "incl. VAT, plus shipping" under the price — `true` for the configured text, or your own text or link to the shipping costs.

## Screen readers

A strikethrough isn't announced, so a sale price reads "Sale price 59,00 €, Original price 79,00 €", and the badge reads "25% off".

## Formatting

Numbers and the currency sign follow `configure({ locale: 'de-DE', currency: 'EUR' })`: "59,00 €" in German, "€59.00" in English. Pass `currency` for a single price in another currency.

## What you provide

`amount` (a number, not a string). Optional: `compareAt`, `showSaving`, `size`, `from`, `unitPrice: { amount, per }`, `taxNote`, `currency`, `strings` (`salePrice`, `originalPrice`, `from`, `perUnit`, `taxNote`, `saving`, `savingLabel`; or once for the shop under `strings.price`).
