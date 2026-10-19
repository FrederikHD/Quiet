# Changelog

All notable changes to `@frederikhd/quiet`. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and versions follow [Semantic Versioning](https://semver.org/): before 1.0, a minor version (0.x.0) may contain
breaking changes, a patch version (0.x.y) never does.

## [Unreleased]

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

[Unreleased]: https://github.com/FrederikHD/Quiet/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/FrederikHD/Quiet/releases/tag/v0.1.0
