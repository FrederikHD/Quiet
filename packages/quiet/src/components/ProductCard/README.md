# ProductCard

A product in a grid — collection pages, search results, "You may also like": image, name, price, and optionally badges, colour dots and a quick add button.

```vue
<QProductCard
  name="Linen shirt"
  href="/products/linen-shirt"
  :image="{ src }"
  :hover-image="{ src: back }"
  :price="59"
  :compare-at="79"
  :badges="[{ label: 'Sale', tone: 'sale' }]"
  :swatches="[{ label: 'Navy', color: '#2f3d5c' }, …]"
  quick-add
  @quick-add="addToCart(id)"
/>
```

## Look

- **The image is the card:** `surface-sunken` behind it, `radius-md`, 4:5 portrait (or `aspect="square"`), no border, no shadow. Keep one shape per catalogue.
- Below: `vendor` (optional, `caption`), the name in `body`, the Price (`small`; on sale in `sale` with the old price struck through), then up to five colour dots and "+2".
- **Badges** sit top left on the image: Sale (`sale`), New (`info`), Sold out (`neutral`). One or two at most.
- **Hover** (pointer devices): the name underlines and `hoverImage` fades in.
- **Sold out:** the image dims and quick add goes away; the card still opens the product.

## Behaviour

- **One link per card:** the name is the link, and it covers the whole card, so a card is one Tab stop and is read as just the product name. Quick add and the dots sit above it.
- **Quick add** (`quick-add`, emits `quick-add`): a round + button on the image, named "Add Linen shirt to cart". Only offer it for products without choices to make (or add the default variant and say so in a Toast).
- The name is a heading (`h3` by default, `headingLevel` to change), so screen-reader users can jump from product to product.

## Layout

The card fills its grid cell. Use a grid of `minmax(200px, 1fr)` columns with `space-6` row and `space-4` column gaps; two columns on phones.

## Keyboard and screen readers

Each card is an `article` named by the product. The name is the one link (Tab stops once per card); quick add follows it, named "Add Linen shirt to cart". Prices read "Sale price … Original price …", colours as "4 colours: Navy, Sand, …".

## Built from

Price, Badge, Rating and Button (quick add).

## Rating

`:rating="{ value: 4.3, count: 31 }"` adds small stars and the count under the price (hidden while there are no reviews).

## What you provide

`name`, `href` (the card emits `navigate` for client-side routing), `image: { src, alt? }`, `price`. Optional: `compareAt`, `priceFrom`, `currency`, `badges: [{ label, tone }]`, `swatches: [{ label, color }]`, `maxSwatches`, `hoverImage`, `vendor`, `soldOut`, `onQuickAdd`, `aspect`, `headingLevel`, `strings` (shop-wide under `strings.productCard`).
