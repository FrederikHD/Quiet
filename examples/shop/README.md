# Example shop

A small shop built with [Quiet](https://frederikhd.github.io/Quiet/) the way an app would use it: Nuxt with server
rendering, `@frederikhd/quiet` installed from npm, in English and German. It runs at
https://frederikhd.github.io/Quiet/example/.

- **Pages:** the products (`/en`, `/de`), a product with colour, size, reviews and related products, the cart, and a
  checkout with validation, the error summary and an address form.
- **Language** comes from the URL. The Quiet plugin gets each request's language, and the German translations are the
  ones from the [Translations guide](https://frederikhd.github.io/Quiet/guides/translations)
  ([`app/locales/de.ts`](app/locales/de.ts)); the shop's own words are in
  [`app/locales/messages.ts`](app/locales/messages.ts).
- **The theme** follows the system, set before the first paint. **The cart** is kept in the browser.
- Moving to another page focuses its heading; Quiet's links (`href`) navigate in the app on a plain click.

## Run it

```sh
npm install
npm run dev        # http://localhost:3000
npm run generate   # every page as static HTML in .output/public
```

## Checked on every change

From the repository root, `npm run test:example` builds and packs the library from this checkout, installs it here in
place of the npm version, type-checks the shop, prerenders every page and opens them in Chromium: axe in both themes,
no console errors (a hydration mismatch is one), the language of each page, phone widths, and a purchase in German.
`npm run test:example -- --from-npm` runs the same checks on the version in `package.json`, exactly as published.
