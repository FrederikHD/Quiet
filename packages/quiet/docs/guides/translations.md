# Translations

Every word Quiet writes itself can be translated: button names screen readers hear ("Clear search"), counts ("3 selected"), messages ("Enter a valid postcode"). The text you pass in, such as labels, titles and hints, is already yours.

## Three layers

Each phrase is looked up in this order, and the first one set wins:

1. The component's own `strings` prop: `<QDialog :strings="{ close: 'Schließen' }">`. Use it for a one-off wording.
2. The shop's translations, set once with `configure({ strings })` or `app.use(Quiet, { strings })`.
3. The built-in English.

The shop's translations are grouped by namespace, and each namespace is merged into what is already there. Setting `{ form: { optional: 'freiwillig' } }` changes that one phrase and keeps the rest of `form`.

```ts
app.use(Quiet, {
  locale: 'de-DE',
  currency: 'EUR',
  strings: { form: { optional: 'freiwillig' }, dialog: { close: 'Schließen' } },
});
```

## Locale and currency

- `locale` (a BCP 47 tag such as `de-DE`, default `en`) formats every number, amount and date: 1240 becomes "1.240", 79 becomes "79,00 €", a review's date becomes "12. Oktober 2026".
- `currency` (an ISO code, default `EUR`) is what `QPrice` and `money()` show. A Price can still take its own `currency`.
- The same formatting is yours to use: `fmt(1240)`, `money(79)` and `currencySymbol()` follow what is configured.

Both can change while the app runs: `configure({ locale: 'en-GB' })` and every component follows. On a server, each app (each request, in Nuxt) has its own settings: see [Getting started](getting-started.md).

## Phrases that take values

Phrases with a number or a name in them are functions, so each language can put the value where it belongs and choose its own plural:

```ts
configure({
  strings: {
    table: { selected: (count) => `${fmt(count)} ausgewählt` },
    search: { searchFor: (q) => `Nach „${q}“ suchen` },
  },
});
```

Use `fmt()` for numbers inside them, so they follow the locale like the built-in phrases do.

## Namespaces

| Namespace                                                                    | Used by                                                                                                                                 |
| ---------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| `form`                                                                       | Form, Field, FieldGroup and every control in them: the optional marker, the help button, message prefixes and the error summary's title |
| `input`, `textarea`, `combobox`, `datePicker`, `stepper`, `upload`, `choice` | Input, Textarea, Combobox, DatePicker, QuantityStepper, FileUpload, Radio and Checkbox tiles                                            |
| `address`                                                                    | AddressFields and `validateAddress` (labels and messages)                                                                               |
| `discount`, `priceRange`, `filterChips`, `rating`                            | DiscountCode, PriceRange, FilterChips, Rating and RatingInput                                                                           |
| `table`, `pagination`, `metric`                                              | Table, Pagination, Metric                                                                                                               |
| `shell`, `nav`, `tabs`, `breadcrumbs`, `steps`, `search`                     | AppShell, Nav, Tabs, Breadcrumbs, Steps, SearchBox                                                                                      |
| `dialog`, `toast`, `notice`, `tag`                                           | Dialog, the toasts, Notice, Tag                                                                                                         |
| `price`, `productCard`, `gallery`, `orderSummary`, `reviewSummary`, `review` | the commerce components                                                                                                                 |

Each component's page lists its phrases and their English under "Translations". The types are exported too (`QuietStrings` for all of them, `TableStrings`, `PaginationStrings` and so on), so your editor completes the keys and checks the functions.

## German, complete

Every phrase, translated. Copy it into your app, change what you'd word differently, and pass it to `configure` (or to `app.use(Quiet, { strings: de })`). It is type-checked against the library on every change to Quiet, so no phrase is missing or misnamed.

<!-- de.ts -->

The informal "du" works as well; keep to one form across the shop.

## Your own components

A component of your own can read the shop's settings with `useConfig()`, which returns the live `locale`, `currency` and `strings`, so it changes language with the rest of the app.
