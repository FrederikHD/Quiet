# Gallery

The product images on a product page: one large image with thumbnails, swipeable on phones, enlargeable in a dialog.

```vue
<QGallery label="Linen shirt images" :images="[{ src, alt: 'Linen shirt in navy, front' }, …]" />
```

## Behaviour

- **Phones and touch screens** (under 640px, or no hover): swipe between images (native scroll snap, one image per swipe); a "2 / 5" counter sits in the corner. No arrows, no thumbnails.
- **Computers** (640px and up, with a pointer): ‹ › buttons on the image and a row of 64px thumbnails below (the current one has a `brand` ring). Arrows and thumbnails show only with two or more images; `:thumbnails="false"` hides the thumbnails.
- **Enlarge:** clicking the image opens it in a Dialog (`lg`, full screen on phones) titled by the image's `alt`, with ‹ › and a "2 / 5" count to move on.
- **Which image:** `v-model:index` (0-based), or `defaultIndex` when it isn't bound. A new set of images (another colour chosen) starts again at the first.
- **No images:** a placeholder icon on `surface-sunken`.

## Images

- Same shape for every image of a product: 4:5 portrait (default) or `aspect="square"`, on `surface-sunken` at `radius-md`, cropped to fill.
- Every image needs `alt` that says what it shows ("Linen shirt in navy, back"). `thumb` and `zoom` let you pass smaller and larger files.

## Keyboard and screen readers

- The stage is a region with the role description "carousel", named by `label` (default "Product images"). Tab reaches it, then the visible image, which is a button named "Enlarge image: Linen shirt in navy, front".
- With the stage or the image focused, ← → move between images and Home / End jump to the first or last. Each move, and each press of ‹ ›, is announced "Image 2 of 5".
- Each image is a slide named "2 of 5". Only the visible one is reachable; the others are hidden from screen readers and from Tab.
- ‹ › are buttons named "Previous image" and "Next image", disabled at either end. The thumbnails are buttons ("Show image 3 of 5"); the current one has `aria-current`.
- Enter or Space on the image opens the large view, where the image reads its `alt`, ← → still move (with the large image focused) and Esc closes it.

## Built from

Button (arrows), Dialog (large view), Icon.

## What you provide

- **Required:** `images` (`[{ src, alt, thumb?, zoom? }]`, main image first).
- **Optional:** `label` (names the carousel, e.g. "Linen shirt images"; default "Product images"), `aspect` (`portrait` | `square`; default `portrait`), `thumbnails` (default true), `defaultIndex`.
- **v-model:** `v-model:index` (the image shown, 0-based).
- **Events:** `@update:index(index)`.
- **Translations:** `strings`, or once for the shop with `configure({ strings: { gallery: … } })`: `label` ("Product images"), `slide(i, n)` ("2 of 5"), `previous` ("Previous image"), `next` ("Next image"), `show(i, n)` ("Show image 3 of 5"), `zoom` ("Enlarge image"), `counter(i, n)` ("2 / 5"), `showing(i, n)` ("Image 2 of 5").
