# Getting started

Quiet is a set of Vue 3 components for commerce: the storefront and the merchant back office, with one set of tokens. This guide takes a new app from install to its first form.

## Install

```sh
npm install @frederikhd/quiet
```

Vue 3.5 or later is a peer dependency. The package is ES modules only.

## Set up with Vite

```ts
// main.ts
import { createApp } from 'vue';
import { Quiet } from '@frederikhd/quiet';
import '@frederikhd/quiet/style.css';
import App from './App.vue';

createApp(App).use(Quiet, { locale: 'de-DE', currency: 'EUR' }).mount('#app');
```

`app.use(Quiet)` does two things: it sets the shop's locale, currency and translations (see [Translations](translations.md)), and registers every component globally as `QButton`, `QField` and so on.

For type-checking in templates, add the global component types to `tsconfig.json`:

```json
{ "compilerOptions": { "types": ["@frederikhd/quiet/global"] } }
```

### Importing components where you use them

Pass `components: false` and import what each file uses. Components you don't import are left out of your bundle:

```ts
app.use(Quiet, { locale: 'de-DE', components: false });
```

```vue
<script setup lang="ts">
import { QButton, QField, QInput } from '@frederikhd/quiet';
</script>
```

The stylesheet is one file either way, and holds every component's styles.

## Set up with Nuxt

Register the plugin in a Nuxt plugin and add the stylesheet in `nuxt.config.ts`:

```ts
// plugins/quiet.ts
import { Quiet } from '@frederikhd/quiet';

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(Quiet, { locale: 'de-DE', currency: 'EUR' });
});
```

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  css: ['@frederikhd/quiet/style.css'],
  app: {
    head: { htmlAttrs: { lang: 'de', 'data-theme': 'light', 'data-density': 'comfortable' } },
  },
});
```

Components render on the server; anything that needs the browser (measuring, focus, observers) runs after mount. Ids come from Vue's `useId`, so they match between the server and the browser.

On the server, every app gets its own locale, currency and translations from the options you pass to `app.use(Quiet, …)`. Nuxt creates an app for each request, so a shop in several languages passes each request's language there, and requests rendering at the same time never mix. Take the language from something the browser sees too, such as the URL, so the page hydrates in the same language it was rendered in:

```ts
// plugins/quiet.ts: /de/… in German, everything else in English
import { Quiet } from '@frederikhd/quiet';
import { de } from '~/locales/de'; // your copy of the German strings from the Translations guide

export default defineNuxtPlugin((nuxtApp) => {
  const german = useRoute().path.startsWith('/de');
  nuxtApp.vueApp.use(Quiet, { locale: german ? 'de-DE' : 'en-GB', strings: german ? de : {} });
});
```

Each app starts from what `configure()` set outside any component, so shop-wide defaults can still be set once at start-up. While a component renders, `money()` and `fmt()` follow its app; elsewhere on the server (a server route, code after an `await` in `setup`) they use those shared defaults. In the browser there is one app, and `configure({ locale })` switches its language.

## The page

Quiet sets its font, background and text colour on `body`. You add three things to the page:

1. **The font.** Load [Inter](https://fonts.google.com/specimen/Inter) in weights 400, 500 and 600. Without it, the system font is used.
2. **The theme and density** on `<html>`: `data-theme="light"` or `"dark"`, `data-density="comfortable"` or `"compact"`. See [Theming](theming.md).
3. **The language**: `<html lang="de">`. Screen readers use it to pick a voice.

```html
<html lang="de" data-theme="light" data-density="comfortable">
  <head>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap" rel="stylesheet" />
  </head>
</html>
```

## The app's frame

Back offices start with an `QAppShell`: a top bar, the navigation, a skip link and the place where toasts show. Each screen is a `QPage` with its title as the page's `h1`:

```vue
<template>
  <QAppShell brand="My shop">
    <template #nav>
      <QNav :sections="sections" />
    </template>
    <QPage title="Products">…</QPage>
  </QAppShell>
</template>
```

Without an AppShell (a storefront with its own header), put `<QToaster />` once in your root component so `toast()` has somewhere to show.

## A first form

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { toast } from '@frederikhd/quiet';

const title = ref('');
</script>

<template>
  <QForm @submit.prevent="toast('Product saved', { tone: 'success' })">
    <QField label="Title" required hint="Shown on the product page.">
      <QInput v-model="title" />
    </QField>
    <QFormActions>
      <QButton variant="primary" type="submit">Save</QButton>
    </QFormActions>
  </QForm>
</template>
```

Every control goes in a `QField`, which gives it its label, hint and error. [Forms](forms.md) shows validation and the error summary.

## How the components work

- **Values use `v-model`**: `v-model` for the main value, and named ones for the rest (`v-model:open`, `v-model:sort`, `v-model:page`).
- **Events, not callbacks**: components emit events (`@vote`, `@remove`, `@commit`) and never take functions as props for actions.
- **Slots for content**: text and markup you provide go in slots (`#reply`, `#actions`); short text goes in props (`title`, `hint`).
- **Images** are `{ src, alt? }` everywhere, and item keys are `string | number`.
- **Development warnings**: a control without a label, a radio outside a RadioGroup and similar mistakes are reported with Vue's own `warn`, with the component they came from. Vue's production build leaves them out.

## Where to go next

- [Translations](translations.md): every built-in word, in German.
- [Theming](theming.md): dark mode, density and your own brand colour.
- [Forms](forms.md): validation, the error summary and server errors.
- [Accessibility](accessibility.md): what Quiet does for you, and what stays with your app.
- [Upgrading](upgrading.md): the breaking changes between versions.
- The patterns (Orders, Product edit, Checkout …) show whole screens built from the components.
- The [example shop](https://frederikhd.github.io/Quiet/example/) is a whole Nuxt app in English and German, from a product list to the order. Its code is in [`examples/shop`](https://github.com/FrederikHD/Quiet/tree/develop/examples/shop).
