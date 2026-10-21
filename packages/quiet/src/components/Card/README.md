# Card

A panel that groups related content on a page: a form section ("Details", "Inventory"), a summary, a short list, a metric.

## Anatomy

- **Surface:** `surface-raised`, a `line` border, `radius-lg`, padded by `--panel-pad` (24px, 16px compact and on phones).
- **Title** (optional, `title` or the `#title` slot): `heading` type (17/24 semibold) as an `h2` (`headingLevel` to change it). It names the card for screen readers.
- **Description** (optional, `description` or the `#description` slot): one line in 13px `ink-muted` under the title, or on its own when there is no title.
- **Actions** (optional, `#actions`): slim ghost Buttons or a link on the right, lined up with the title: "Edit", "Adjust", "View all".
- **Body:** the content, with `--field-gap` (16px, 12px compact) between direct children.
- **Footer** (optional, `#footer`): a `line` rule above, for the card's own buttons ("Save note").
- **`flush`:** no padding around the body, for lists whose rows reach the edges. The header then gets a rule under it.

## When to use

- **Card:** groups that belong together on a page, especially in a two-column Page.
- **No card:** a Table already has its own frame, so put it straight on the page, not in a Card. One single form on a narrow page doesn't need a card either.
- **Not for clickable tiles.** A Card isn't a button. Put a link or Button inside it.

## Keyboard and screen readers

- A Card is a `section`. With a title it's labelled by its heading (`aria-labelledby`), so screen readers list it as a named region; without one it isn't announced as a region.
- Pick `headingLevel` so the outline stays in order: `h2` under the Page's `h1`, `h3` for a Card inside a Card or a tab.
- The Card itself is never focusable; only the controls inside it are.

## What you provide

- **Required:** the content (default slot).
- **Optional:** `title`, `description`, `flush` (no body padding), `headingLevel` (2–6, default 2).
- **Slots:** the default slot (the body), `#title` and `#description` (instead of the props), `#actions` (on the title line), `#footer` (under a rule).
