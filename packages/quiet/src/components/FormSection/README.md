# FormSection

A titled block of related fields inside a Form — "Product details", "Pricing", "Shipping address" — so a long form reads as a few short ones.

## Layout

- **stack** (default) — heading, optional description, then the fields.
- **aside** — heading and description in a left third, fields in the right two thirds, once the section is 760px wide; stacked below that. Settings pages and long back-office edit screens, where the description explains the section.

## Content

- Title: a short noun phrase in `heading` style. Description: one sentence in `small` `ink-muted` about why or where it applies — "Customers see this on the product page."
- Consecutive sections are separated by a `line` rule and `space-6`.
- `headingLevel` (default 2) keeps the page outline right: use 3 when the form sits under its own h2.
- For rich content, use the `#title` and `#description` slots instead of the props.

## Keyboard and screen readers

No keys of its own. The section is a `<section>` named by its heading, so screen readers list it as a region ("Pricing, region") and can jump between sections by heading. Without a title it is a plain container.

## What you provide

- **Optional:** `title` ("Pricing"), `description`, `layout` (`stack` | `aside`; default `stack`), `headingLevel` (2–6; default 2).
- **Slots:** the default slot (the Fields and FieldGroups), `#title`, `#description`.
