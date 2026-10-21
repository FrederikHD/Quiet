# @frederikhd/quiet

A calm, neutral-first design system for commerce, as Vue 3 components: one set of tokens and components for the
storefront and the merchant back office. Accessible (WCAG 2.2 AA), responsive, light and dark, two densities.

**Documentation, examples and a live playground:** https://frederikhd.github.io/Quiet/

**Guides:** [Getting started](https://frederikhd.github.io/Quiet/guides/getting-started) (Vite and Nuxt) ·
[Translations](https://frederikhd.github.io/Quiet/guides/translations) (with every phrase in German) ·
[Theming](https://frederikhd.github.io/Quiet/guides/theming) · [Forms](https://frederikhd.github.io/Quiet/guides/forms) ·
[Accessibility](https://frederikhd.github.io/Quiet/guides/accessibility) ·
[Upgrading](https://frederikhd.github.io/Quiet/guides/upgrading)

## Install

```sh
npm install @frederikhd/quiet
```

Vue 3.5 or later is a peer dependency.

## Set up

```ts
import { createApp } from 'vue';
import { Quiet } from '@frederikhd/quiet';
import '@frederikhd/quiet/style.css';
import App from './App.vue';

createApp(App).use(Quiet, { locale: 'de-DE', currency: 'EUR' }).mount('#app');
```

`app.use(Quiet)` registers every component globally. For template type-checking, add the global types to your
`tsconfig.json`:

```json
{ "compilerOptions": { "types": ["@frederikhd/quiet/global"] } }
```

Prefer explicit imports? Pass `{ components: false }` and import what you use — unused components are tree-shaken:

```ts
import { QButton, QField, QInput } from '@frederikhd/quiet';
```

Load [Inter](https://fonts.google.com/specimen/Inter) (400, 500, 600) and set the theme and density on `<html>`:

```html
<html data-theme="light" data-density="comfortable"></html>
```

`data-theme` is `light` or `dark`; `data-density` is `comfortable` or `compact`, and can also be set on any container.

Toasts (`toast('Saved')`) show in a `<QToaster />`. `QAppShell` includes one; without it, put `<QToaster />` once in
your root component.

## Use

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { toast } from '@frederikhd/quiet';

const title = ref('');
</script>

<template>
  <QForm @submit.prevent="toast('Product saved')">
    <QField label="Title" required hint="Shown on the product page.">
      <QInput v-model="title" />
    </QField>
    <QFormActions>
      <QButton variant="primary" type="submit">Save</QButton>
    </QFormActions>
  </QForm>
</template>
```

Values use `v-model` everywhere (`v-model:open`, `v-model:sort`, `v-model:page` …), components emit events rather than
taking callback props, and rich content goes in slots.

## What's in it

50 components in eight groups: foundations (Icon), actions (Button, Menu), layout and navigation (AppShell, Page, Card,
Tabs, Steps …), forms (Form, Field, Input, Select, Combobox, AddressFields, FileUpload …), data (Table, Pagination,
DescriptionList, Metric), commerce (Price, ProductCard, Gallery, OrderSummary, Rating, ReviewSummary, Review), overlays
(Popover, Dialog) and feedback (Badge, Tag, Notice, Toast, EmptyState).

Also exported: `QPageColumns` (Page's two columns inside a Form) and `QToaster` (where toasts show); `configure` and
`useConfig` (locale, currency and translated strings); `money`, `fmt`, `currencySymbol` and `formatSize` (formatting);
`toast` and `dismissToast` (notifications); `validateAddress`, `addressCountries` and `addressFormats` (addresses);
`useFieldControl` (wires your own control into a Field); `useStickyPad` (for your own sticky bars); `icons` and
`iconNames`; and every prop and item type.

## Translations

Every built-in word can be translated once for the whole app, or per component with its `strings` prop:

```ts
app.use(Quiet, { locale: 'de-DE', strings: { form: { optional: 'freiwillig' }, dialog: { close: 'Schließen' } } });
```

The [Translations guide](https://frederikhd.github.io/Quiet/guides/translations) has every phrase in German, ready to
copy.

## Tokens

The design tokens are available as CSS custom properties (`var(--brand)`, `var(--space-4)` …, included in
`style.css`), and as `@frederikhd/quiet/tokens.css` and `@frederikhd/quiet/tokens.json` on their own.

## Server rendering

Components render on the server (Nuxt, `vue/server-renderer`); browser-only work runs after mount. On the server, each
app keeps its own locale, currency and translations from `app.use(Quiet, …)`, so requests in different languages
rendering at the same time never mix.

## Licence

MIT
