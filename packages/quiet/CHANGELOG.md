# Changelog

All notable changes to `@frederikhd/quiet`. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and versions follow [Semantic Versioning](https://semver.org/): before 1.0, a minor version (0.x.0) may contain
breaking changes, a patch version (0.x.y) never does.

## [Unreleased]

### Added

- `@frederikhd/quiet/package.json` can be imported, for tools that read the installed version.

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
