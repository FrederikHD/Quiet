# FormSection

A titled block of related fields inside a Form — "Product details", "Pricing", "Shipping address" — so a long form reads as a few short ones.

## Layout

- **stack** (default) — heading, optional description, then the fields.
- **aside** — heading and description in a left third, fields in the right two thirds, once the section is 760px wide; stacked below that. Settings pages and long back-office edit screens, where the description explains the section.

## Content

- Title: a short noun phrase in `heading` style. Description: one sentence in `small` `ink-muted` about why or where it applies — "Customers see this on the product page."
- Consecutive sections are separated by a `line` rule and `space-6`.
- `headingLevel` (default 2) keeps the page outline right: use 3 when the form sits under its own h2.

## What you provide

`title`, optionally `description`, `layout`, `heading-level`, and the Fields and FieldGroups in the default slot.
