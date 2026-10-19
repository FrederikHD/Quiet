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
  @navigate="openProduct"
/>
```

## Look

- **The image is the card:** `surface-sunken` behind it, `radius-md`, 4:5 portrait (or `aspect="square"`), no border, no shadow. Keep one shape per catalogue.
- Below: `vendor` (optional, `caption`), the name in `body`, the Price (`small`; on sale in `sale` with the old price struck through; `priceFrom` adds "from"), the Rating, then up to `maxSwatches` (default 5) colour dots and "+2".
- **No image:** a placeholder icon on `surface-sunken`.
- **Badges** sit top left on the image: Sale (`sale`), New (`info`), Sold out (`neutral`). One or two at most.
- **Hover** (pointer devices): the name underlines and `hoverImage` fades in.
- **Sold out:** the image dims and quick add goes away; the card still opens the product.

## Behaviour

- **One link per card:** the name is the link to `href`, and it covers the whole card, so a click anywhere opens the product. The dots sit above it (their colour names show on hover). Without `href` the name isn't a link, so always pass one.
- **Client-side routing:** clicking the link emits `@navigate(event)`; call `event.preventDefault()` and route yourself.
- **Quick add** (the `quickAdd` prop, emits `@quick-add`): a round + button on the image, named "Add Linen shirt to cart". Only offer it for products without choices to make (or add the default variant and say so in a Toast).
- The name is a heading (`h3` by default, `headingLevel` to change), so screen-reader users can jump from product to product.

## Layout

The card fills its grid cell. Use a grid of `minmax(200px, 1fr)` columns with `space-6` row and `space-4` column gaps; two columns on phones.

## Keyboard and screen readers

- Each card is an `article` named by the product.
- The name is the one link, so Tab stops once per card, or twice with quick add: the link first, then the + button ("Add Linen shirt to cart"). Enter opens the product; Enter or Space presses quick add.
- Images: the main image reads its `alt` (leave it empty when it only shows the product named below); the hover image and the placeholder are hidden.
- Prices read "Sale price … Original price …", the rating "Rated 4,3 out of 5, 31 reviews", colours "4 colours: Navy, Sand, …". The dots and "+2" are hidden.

## Built from

Price, Badge, Rating, Button (quick add) and Icon (placeholder).

## Rating

`:rating="{ value: 4.3, count: 31 }"` adds small stars and the count under the price (hidden while there are no reviews).

## What you provide

- **Required:** `name`, `href` (the product page).
- **Optional:** `image` (`{ src, alt? }`), `hoverImage` (`{ src }`), `price` (a number), `compareAt`, `priceFrom`, `currency`, `rating` (`{ value, count }`), `badges` (`[{ label, tone }]`), `swatches` (`[{ label, color }]`), `maxSwatches` (default 5), `vendor`, `soldOut`, `quickAdd`, `aspect` (`portrait` | `square`; default `portrait`), `headingLevel` (2–6; default 3).
- **Events:** `@navigate(event)` (the link was clicked), `@quick-add` (the + button was pressed).
- **Translations:** `strings`, or once for the shop with `configure({ strings: { productCard: … } })`: `quickAdd(name)` ("Add Linen shirt to cart"), `colours(n)` ("4 colours"), `more(n)` ("+2").
