# Card

A panel that groups related content on a page: a form section ("Details", "Inventory"), a summary, a short list, a metric.

## Anatomy

- **Surface:** `surface-raised`, a `line` border, `radius-lg`, padded by `--panel-pad` (24px, 16px compact and on phones).
- **Title** (optional): `heading` type (17/24 semibold) as an `h2` (`headingLevel` to change it). It names the card as a region for screen readers.
- **Description** (optional): one line in `ink-muted` under the title.
- **Actions** (optional): slim ghost Buttons or a link on the right, lined up with the title: "Edit", "Adjust", "View all".
- **Body:** the content, with `--field-gap` between direct children.
- **Footer** (optional): a `line` rule above, for the card's own buttons ("Save note").
- **`flush`:** no padding around the body, for lists whose rows reach the edges. The header then gets a rule under it.

## When to use

- **Card:** groups that belong together on a page, especially in a two-column Page.
- **No card:** a Table already has its own frame, so put it straight on the page, not in a Card. One single form on a narrow page doesn't need a card either.
- **Not for clickable tiles.** A Card isn't a button. Put a link or Button inside it.

## What you provide

- **Required:** the content (default slot).
- **Optional:** `title`, `description`, the `#actions` and `#footer` slots, `flush`, `heading-level`, `class`, `style`.
