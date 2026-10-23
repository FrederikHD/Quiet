# Changelog

All notable changes to `@frederikhd/quiet`. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and versions follow [Semantic Versioning](https://semver.org/): from 1.0.0, breaking changes come only in a major version
(2.0.0), new features in a minor version (1.1.0) and fixes in a patch (1.0.1). What counts as breaking is in the
README, under "Stability". Before 1.0, a minor version (0.x.0) could contain breaking changes.

## [Unreleased]

### Added

- A section in the Forms guide on what `type="email"` accepts (`anna@shop` is valid HTML) and how to require a dot in the
  domain.

### Fixed

- A field the browser had filled in (autofill) lost the inner half of its focus ring: the field was painted white to hide
  the browser's blue, which covered it. The browser's colour is now held back instead of painted over, for Input,
  Textarea and Select, so the ring stays whole and read-only and disabled fields keep their grey.

## [1.0.0] - 2026-10-21

The first stable release: the same components as 1.0.0-rc.1, now on npm's `latest` tag. From here on, the API only
changes in a backwards-compatible way until 2.0.0 (see "Stability" in the README). No breaking changes since 0.6.0;
everything since then is listed under 1.0.0-rc.1.

## [1.0.0-rc.1] - 2026-10-21

The release candidate for 1.0.0, published under npm's `next` tag (`npm install @frederikhd/quiet@next`). The API is
what 1.0.0 will have: until then, only fixes. No breaking changes since 0.6.0.

### Added

- Guides on the documentation site, for adopting Quiet in an app: Getting started (Vite and Nuxt), Translations (with
  every built-in phrase in German, checked against the types), Theming (dark mode, density, your own brand colour),
  Forms (validation, the error summary, server errors), Accessibility (what Quiet does and what stays with the app) and
  Upgrading (every breaking change since 0.1). The README links to them.
- An example shop built with Nuxt in English and German, installed from npm like an adopter's app, at
  https://frederikhd.github.io/Quiet/example/. CI builds it with every change to the library and checks it in a
  browser.

### Fixed

- Server rendering in several languages: each app that installs the plugin keeps its own locale, currency and
  translations on the server, so two requests rendering at the same time no longer take each other's language. Nuxt
  creates an app per request, so `nuxtApp.vueApp.use(Quiet, { locale })` with the request's language is enough. In
  the browser nothing changes: `configure()` and `money()` keep working anywhere, with the one shared setting.
- OrderSummary without items (the totals beside a cart that lists its own lines) shows the totals alone: no empty list,
  no "0 items" beside the title, and no rule above the subtotal.

## [0.6.0] - 2026-10-21

### Added

- Checkbox `required` and `error`, for a single checkbox in a form ("I accept the terms"): the message shows under
  it, lined up with the label, describes the box and links from the Form's error summary through its `id`. A
  one-checkbox CheckboxGroup is no longer needed. With `error` bound (even to `null`), the checkbox and its message sit in a
  `div.q-check`, which then takes the `class` and `style` you pass; without it the markup is unchanged.
- Named types for every `strings` prop that had an inline one: `BreadcrumbsStrings`, `MetricStrings`,
  `ProductCardStrings`, `QuantityStepperStrings`, `ReviewSummaryStrings`, `StepsStrings` and `TabsStrings`.

### Removed

- **Breaking:** the last label props outside `strings`, so every built-in word is translated the same way:
  - Input `clearLabel` → `:strings="{ clear: 'Leeren' }"` (new `InputStrings`).
  - Dialog `closeLabel` → `:strings="{ close: 'Schließen' }"` (new `DialogStrings`). `closeText`, the visible text
    of a close button, stays.
  - AppShell `toastStrings` → `configure({ strings: { toast: { dismiss, region } } })`, which the Toaster already
    read.

### Fixed

- Every `v-model` event is typed with exactly its value. CheckboxGroup, RadioGroup, Select, Combobox, Input,
  Textarea, QuantityStepper, RatingInput, Tabs, Gallery (`index`), OrderSummary (`open`) and Table (`sort`,
  `selected`) declared theirs with `| undefined`, so `@update:model-value="x = $event"` needed `?? []` or a cast.
- ProductCard `hoverImage` takes `{ src, alt? }` like every other image (its `alt` isn't read: it's decorative).
- Popover `panelClass` is typed like `class` instead of `unknown`.

From a full audit of every component, example and pattern:

- **Focus no longer drops to the page** when the control that had it goes away or becomes unusable:
  - a loading Button stays focusable (`aria-disabled`, presses ignored), and so do DiscountCode's Apply and the
    focused control of a `disabled` Pagination;
  - Toast returns focus after Undo or ×, and stays paused while it has focus even when the mouse leaves;
  - Table moves focus to "Select all" when the bulk bar closes;
  - Gallery moves focus to the other arrow when the focused one reaches the end;
  - Combobox's "Try again" focuses the search field;
  - a Popover, Menu or Combobox that closes because its trigger scrolled away returns focus to the trigger;
  - DiscountCode returns focus to the field after a code is applied;
  - FilterChips refocuses after an app updates its items asynchronously.
- Dialog opens on the first control Tab would reach, and on the checked radio of a radio group.
- A Popover tip closes when focus leaves the page.
- Gallery shows the image set through `v-model:index`, and its empty placeholder follows `aspect="square"`.
- Pagination: Ctrl/Cmd, Shift, Alt and middle clicks on page links open a new tab; a new page size keeps the first
  row in view and updates `v-model:page`.
- Table: the phone "Sort by" can't be set back to its placeholder; a table that only scrolls vertically (`maxHeight`)
  is a focusable scroll region.
- Select with `<option>` children sizes itself with `width: auto`.
- PriceRange: two handles at the top end can be dragged apart; `@commit` only fires for a change; typed prices are read
  in the configured locale ("1.000,50").
- ProductCard: a click on a badge opens the product.
- RatingInput fits a phone: full-size star targets, the word on its own line.
- QuantityStepper keeps to the step grid when `max` isn't on it.
- FieldGroup's `required` makes every control in it announced as required; parts with hidden labels leave no gap.
- FormActions `sticky` keeps focused fields clear of the bar inside a scrolling box, not only the page.
- Textarea announces "8 characters left" from a live region that is always on the page.
- Notice merges `strings.prefix` per tone.
- SearchBox doesn't announce "No suggestions" when it never had any.
- ReviewSummary rows all read "5 stars, 20 reviews".
- AddressFields: a phone needs at least 6 digits; `countryPlaceholder` defaults to "Choose a country".
- Small fixes: a slim Input's icon grows with it on phones; Nav's badge name has no stray space; an icon-only full-width
  Button fills the width; the AppShell drawer shows the first link's focus ring; Card shows a description without a
  title; an unlabelled CheckboxGroup has no empty group role.

## [0.5.0] - 2026-10-20

### Added

- Review: one customer review — stars, title, author, date in the shop's locale, "Verified purchase", what they
  bought, text that folds after five lines with "Read more", the shop's reply and a "Helpful" toggle. An `article`
  named by its title. The Product page pattern lists them with a sort order and "Show more".
- FileUpload reordering: each image gets a handle to drag it into a new place, move it with the arrow keys (Home and
  End to the ends), or click for a menu of moves ("Make main image", "Move earlier", …). Every move is announced. On by
  default for images, where the first is the main image; `reorderable` turns it on for files. New strings for the
  handle, its menu and the announcements.
- The `grip` icon, for drag handles.
- Table `cardsBelow`: the table's own width under which `mobile="cards"` turns rows into cards (default 640, as
  before). A table of a few columns in a narrow column, such as a variants table beside a side panel, can stay a
  table until it's on a phone. The switch is now measured with a ResizeObserver instead of a container query; with
  server rendering, cards appear once the page hydrates.

### Changed

- Development warnings (a field without a label, a radio outside a RadioGroup …) go through Vue's own `warn`. They
  show in development as before, now with the component they came from, and reach `app.config.warnHandler` if the
  app sets one; Vue's production build turns them off. The package no longer reads `process.env`. Tests that spy on
  `console.warn` now see "[Vue warn]: [Quiet] …" followed by the component trace.
- The published `dist/quiet.js` is no longer minified, so it reads like the source. Apps minify it when they build.

### Fixed

- A Popover holding a field (a CheckboxGroup of columns, a RadioGroup, a Field) shrank to its padding: those
  measure their own width, so they gave the panel none to fit. The panel now takes its full width (320px, or the
  screen less 16px) when it holds one, and `align="end"` lines it up with the trigger's end again.

## [0.4.0] - 2026-10-20

### Changed

- Select given `width: auto` (a sort order in a toolbar) is as wide as its longest option or placeholder, instead of
  shrinking to its icon and chevron.
- An Input in a Table cell (stock, a variant's price) takes the column's width instead of setting it. Before, every
  column of inputs was at least about 190px wide, the native input's default 20 characters.

### Fixed

- Components that adapt to their own width (DescriptionList, Table, Steps, Pagination, Breadcrumbs, Field, FieldGroup,
  FormSection, FormActions, Page) collapsed to a sliver in a grid that aligns its items to the start: a size container
  takes no width from its content. They now stretch across the column there.
- OrderSummary left an empty band between two rules when its slot rendered nothing (a DiscountCode behind `v-if`).

## [0.3.0] - 2026-10-20

### Added

- Button `count` and `countLabel`: a number on the button (the items in a cart, unread messages), a bubble on an
  icon-only button and a pill after a label. Screen readers hear it with the button's name ("Cart, 2 items").
- `ImageSource` (`{ src, alt? }`) and `ItemKey` (`string | number`) types, shared by the components below.

### Changed

- **Breaking:** every `image` takes `{ src, alt? }`, like ProductCard and OrderSummary already did: SearchBox
  suggestions, Combobox options, and Radio and Checkbox tiles (they were URL strings). Where the label beside it names
  the item, the picture is decorative and `alt` is not used.
- **Breaking (types):** the keys of items you pass in accept numbers as well as strings, like Table's row keys:
  SearchBox suggestion `id`, OrderSummary item `id`, the `key` of Steps, Menu, DescriptionList, Nav, FilterChips (and
  its `@remove` payload) and FileUpload items. Code that reads a key back as a string may need to widen its type.

### Fixed

- A QuantityStepper in a Field with `width="xs"` (as the guidelines suggest for quantities) was squeezed and its +
  button stuck out. The Field no longer narrows a stepper, which sizes itself.

## [0.2.1] - 2026-10-20

No changes to the components, their styles or their types: the package's contents are the same as 0.2.0.

### Changed

- The documentation site shows this released version by default, with a switch to the develop version, which shows
  what the next release will contain.
- Published through npm trusted publishing, without a long-lived token; with provenance as before.

## [0.2.0] - 2026-10-19

### Added

- `@frederikhd/quiet/package.json` can be imported, for tools that read the installed version.
- Nav has its own translations namespace: `configure({ strings: { nav: { label } } })`, and `NavStrings` is exported.

### Changed

- **Breaking:** ProductCard's `href` is required. The name is the card's only link; without it, keyboard users couldn't
  reach the product. An empty `href` warns in development.
- **Breaking:** Nav's landmark name is `strings.label` (was `strings.nav`), set globally under `strings.nav` (was
  `strings.shell.nav`).
- Table offers "Select all 1,240" only when `v-model:all-matching` is bound, since otherwise nothing acts on all
  matching rows.
- Icons in secondary and ghost buttons are `brand`, as the brand book says for buttons that act or open a menu. Links
  styled as buttons, solid buttons and disabled buttons keep the label's colour.

### Removed

- **Breaking:** strings that were never shown: SearchBox `strings.submit`, AppShell `strings.nav` (see Nav above) and
  the form strings' `required`.

## [0.1.0] - 2026-10-19

First release.

### Added

- 49 Vue 3 components in eight groups: foundations (Icon), actions (Button, Menu), layout and navigation (AppShell,
  Nav, Page, PageColumns, Card, Disclosure, Tabs, Breadcrumbs, Steps, SearchBox), forms (Form, FormSection, Field,
  FieldGroup, Input, Textarea, Select, Combobox, QuantityStepper, Checkbox, CheckboxGroup, Radio, RadioGroup,
  FileUpload, AddressFields, DiscountCode, PriceRange, FilterChips, RatingInput, FormActions), data (Table,
  Pagination, DescriptionList, Metric), commerce (Price, ProductCard, Gallery, OrderSummary, Rating, ReviewSummary),
  overlays (Popover, Dialog) and feedback (Badge, Tag, Notice, Toast with `toast()`, EmptyState).
- The `Quiet` plugin, which registers every component and configures locale, currency and strings; global component
  types at `@frederikhd/quiet/global`.
- `configure` / `useConfig`, `money`, `fmt` and `currencySymbol` for formatting; `validateAddress`; `iconNames`.
- Design tokens as CSS custom properties, in `style.css`, `tokens.css` and `tokens.json`; light and dark themes and
  comfortable and compact densities through `data-theme` and `data-density`.
- WCAG 2.2 AA throughout: keyboard support, focus management, screen-reader announcements, both themes checked with
  axe; layouts that adapt to their own width; print styles; server rendering.

[Unreleased]: https://github.com/FrederikHD/Quiet/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/FrederikHD/Quiet/compare/v1.0.0-rc.1...v1.0.0
[1.0.0-rc.1]: https://github.com/FrederikHD/Quiet/compare/v0.6.0...v1.0.0-rc.1
[0.6.0]: https://github.com/FrederikHD/Quiet/compare/v0.5.0...v0.6.0
[0.5.0]: https://github.com/FrederikHD/Quiet/compare/v0.4.0...v0.5.0
[0.4.0]: https://github.com/FrederikHD/Quiet/compare/v0.3.0...v0.4.0
[0.3.0]: https://github.com/FrederikHD/Quiet/compare/v0.2.1...v0.3.0
[0.2.1]: https://github.com/FrederikHD/Quiet/compare/v0.2.0...v0.2.1
[0.2.0]: https://github.com/FrederikHD/Quiet/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/FrederikHD/Quiet/releases/tag/v0.1.0
