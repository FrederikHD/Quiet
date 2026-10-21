# Theming

Quiet's look comes from design tokens: CSS custom properties such as `--brand`, `--surface` and `--space-4`. Every component reads them, so the theme, density and brand colour change with a few attributes and variables. You don't need to override component classes.

## Light and dark

Set `data-theme` on `<html>`:

```html
<html data-theme="dark"></html>
```

Without it the page is light. Quiet doesn't follow the system setting by itself, so your app decides. To follow the system:

```ts
const dark = matchMedia('(prefers-color-scheme: dark)');
const apply = () => document.documentElement.setAttribute('data-theme', dark.matches ? 'dark' : 'light');
apply();
dark.addEventListener('change', apply);
```

If people can choose, remember their choice and set the attribute before the app mounts. With server rendering, put it in the HTML so the page doesn't flash light first.

`data-theme` also works on any element, so one area can be dark inside a light page. Native parts such as scrollbars, autofill and date pickers follow the theme too.

## Density

`data-density` is `comfortable` (the default) or `compact`:

- **comfortable**: 40px controls, 56px table rows. The storefront and back-office forms.
- **compact**: 32px controls, 40px table rows. Data-heavy back-office screens: orders, products, customers.

Set it on `<html>` for the whole app, or on any container: the nearest one wins. Form, Page, Table and Dialog also take a `density` prop that sets it for what's inside them. Large buttons (`size="large"`, for Add to cart and Checkout) stay 48px tall in either density.

## Your brand colour

`--brand` is the one accent: primary buttons, links, focus rings and selected states. To use your own, set it and its companions after Quiet's stylesheet, for both themes:

```css
/* After @frederikhd/quiet/style.css */
:root,
[data-theme='light'] {
  --brand: #3a4fa0;
  --brand-hover: #2f4185;
  --brand-active: #25346b;
  --brand-tint: #e8ebf7;
  --brand-tint-hover: #d7ddf1;
}
[data-theme='dark'] {
  --brand: #9fb0ec;
  --brand-hover: #b3c1f0;
  --brand-active: #c7d1f4;
  --brand-tint: #1f2846;
  --brand-tint-hover: #283357;
}
```

Keep the contrast the defaults have, or the components stop being accessible:

- `--on-solid` (white in light, near-black in dark) on `--brand`, `--brand-hover` and `--brand-active`: at least 4.5:1, since button labels sit on them.
- `--brand` on `--surface` and `--surface-raised`: at least 4.5:1, since links are brand-coloured text.
- `--brand` against the surfaces: at least 3:1 for the focus ring. The 4.5:1 above covers it.
- `--ink` and `--brand` on `--brand-tint` and `--brand-tint-hover`: at least 4.5:1, for selected rows, chips and the active nav item.

The example above keeps all of these, at 7:1 or more for button labels and links in both themes. The Tokens page lists every colour with what it's for and its contrast.

## Other tokens

The same works for any token: spacing (`--space-1` to `--space-16`), radii (`--radius-sm` to `--radius-full`), control heights, type (`--font-sans`, `--text-body` …) and the status colours. For example, a squarer look:

```css
:root {
  --radius-md: 4px;
  --radius-lg: 8px;
}
```

Change values, not meanings: a status colour still has to say the same thing, and controls need their height for touch.

## Using the tokens in your own CSS

Your own components can use the same variables, so they follow the theme and density:

```css
.order-note {
  padding: var(--space-4);
  border: 1px solid var(--line);
  border-radius: var(--radius-lg);
  background: var(--surface-raised);
  color: var(--ink-muted);
  font: var(--text-small);
}
```

The tokens on their own, without the components' styles, are in `@frederikhd/quiet/tokens.css`. `@frederikhd/quiet/tokens.json` has every token with its value and usage, for design tools and your own build.

## Print

Quiet's stylesheet includes print styles. A printed page always uses the light theme. The navigation, toasts, page actions and controls that do nothing on paper (search, filters, table selection) are left out, cards and table rows aren't split across pages, and every tab's content prints.
