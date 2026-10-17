# Gallery

The product images on a product page: one large image with thumbnails, swipeable on phones, enlargeable in a dialog.

```vue
<QGallery label="Linen shirt images" :images="[{ src, alt: 'Linen shirt in navy, front' }, …]" />
```

## Behaviour

- **Phones (touch):** swipe between images (native scroll snap, one image per swipe); a "2 / 5" counter sits in the corner.
- **Computers:** ‹ › buttons on the image and a row of thumbnails below (the current one has a `brand` ring). With the image focused, ← → (and Home / End) move between images.
- **Enlarge:** clicking or pressing Enter on the image opens it in a Dialog (full screen on phones) with ‹ › to move on.
- **A new set of images** (another colour chosen) starts again at the first.
- **Screen readers:** the image area is a carousel region; each image is "slide 2 of 5", and moving announces "Image 2 of 5". Only the visible image is reachable.

## Images

- Same shape for every image of a product: 4:5 portrait (default) or `aspect="square"`, on `surface-sunken` at `radius-md`, cropped to fill.
- Every image needs `alt` that says what it shows ("Linen shirt in navy, back"). `thumb` and `zoom` let you pass smaller and larger files.

## Keyboard and screen readers

The stage is a carousel region: Tab to it, ← → change the image (announced "Image 2 of 5"), Home/End jump. Each slide is "2 of 5"; the thumbnails are buttons ("Show image 3 of 5") with the current one marked. Enter on the image opens the large view, Esc closes it.

## Built from

Button (arrows), Dialog (large view), Icon.

## What you provide

`images`: `{ src, alt, thumb?, zoom? }`. Optional: `label` (names the carousel, e.g. the product), `aspect`, `:thumbnails="false"`, `v-model:index` (or `default-index`), `strings` (shop-wide under `strings.gallery`).
