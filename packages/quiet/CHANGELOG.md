# Changelog

All notable changes to `@frederikhd/quiet`. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and versions follow [Semantic Versioning](https://semver.org/): before 1.0, a minor version (0.x.0) may contain
breaking changes, a patch version (0.x.y) never does.

## [Unreleased]

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

[Unreleased]: https://github.com/FrederikHD/Quiet/compare/v0.4.0...HEAD
[0.4.0]: https://github.com/FrederikHD/Quiet/compare/v0.3.0...v0.4.0
[0.3.0]: https://github.com/FrederikHD/Quiet/compare/v0.2.1...v0.3.0
[0.2.1]: https://github.com/FrederikHD/Quiet/compare/v0.2.0...v0.2.1
[0.2.0]: https://github.com/FrederikHD/Quiet/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/FrederikHD/Quiet/releases/tag/v0.1.0
