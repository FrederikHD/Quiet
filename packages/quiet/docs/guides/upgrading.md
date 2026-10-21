# Upgrading

From 1.0.0, breaking changes come only in a major version (2.0.0); minor and patch versions are safe to install. Before 1.0, a minor version (0.x.0) could contain breaking changes. This page lists every breaking change with what to do about it, newest first. The changelog has everything else that changed.

To upgrade, install the new version, then work through the sections between your version and it:

```sh
npm install @frederikhd/quiet@latest
```

Type-checking your templates (see [Getting started](getting-started.md)) finds most of these for you.

## 0.6 → 1.0

No breaking changes: install 1.0.0 and you're done.

## 0.5 → 0.6

**Label props moved into `strings`.** Every built-in word is now translated the same way.

| Before                                             | After                                                    |
| -------------------------------------------------- | -------------------------------------------------------- |
| `<QInput clear-label="Leeren">`                    | `<QInput :strings="{ clear: 'Leeren' }">`                |
| `<QDialog close-label="Schließen">`                | `<QDialog :strings="{ close: 'Schließen' }">`            |
| `<QAppShell :toast-strings="{ dismiss, region }">` | `configure({ strings: { toast: { dismiss, region } } })` |

Better still, set them once for the shop: `configure({ strings: { input: { clear: 'Leeren' }, dialog: { close: 'Schließen' } } })`. Dialog's `closeText`, the visible text of a close button, stays.

**`v-model` events are typed exactly.** If you wrote `@update:model-value="x = $event ?? []"` or a cast to get around `| undefined`, you can drop it. Nothing breaks if you leave it.

**A checkbox with `error` is wrapped.** With `error` bound (even to `null`), a Checkbox and its message sit in a `div.q-check`, which takes the `class` and `style` you pass. CSS that targeted the checkbox row directly may need the new wrapper.

## 0.4 → 0.5

No breaking changes. Development warnings now go through Vue's `warn`: tests that spy on `console.warn` see "[Vue warn]: [Quiet] …" followed by the component trace, and an app's `app.config.warnHandler` receives them.

## 0.3 → 0.4

No breaking changes.

## 0.2 → 0.3

**Every `image` is `{ src, alt? }`.** SearchBox suggestions, Combobox options, and Radio and Checkbox tiles took a URL string:

```ts
// Before
{ id: 1, label: 'Linen shirt', image: '/img/linen.jpg' }
// After
{ id: 1, label: 'Linen shirt', image: { src: '/img/linen.jpg' } }
```

Where the label beside it names the item, the picture is decorative and its `alt` isn't used.

**Item keys can be numbers.** The `id` or `key` of SearchBox suggestions, OrderSummary items, Steps, Menu, DescriptionList, Nav, FilterChips and FileUpload items is `string | number` (the `ItemKey` type). Code that reads a key back, such as FilterChips' `@remove` payload, and expects a string may need to widen its type.

## 0.1 → 0.2

**ProductCard needs an `href`.** The product's name is the card's only link. Pass the product page's URL.

**Nav's landmark name moved.** It's `strings.label` (was `strings.nav`), and set globally under `strings.nav` (was `strings.shell.nav`):

```ts
// Before
configure({ strings: { shell: { nav: 'Hauptmenü' } } });
// After
configure({ strings: { nav: { label: 'Hauptmenü' } } });
```

**Strings that were never shown are gone:** SearchBox `strings.submit`, AppShell `strings.nav` and the form strings' `required`. Delete them from your translations.
