# Nav

The back-office navigation: sections of links with icons, counts, the current page, and sub-pages. It lives in an AppShell.

## Anatomy

- **Items:** an icon (`ctl-icon`, `ink-muted`), the label in medium weight, and an optional count badge on the right. Each item is as tall as a control (40px, 32px compact) and has `radius-md`.
- **Current page:** `brand-tint` fill with `brand` text and icon, in semibold, plus `aria-current="page"`.
- **Sub-pages:** shown under their parent while the parent or one of them is current (or `expanded`). They're indented to the label, without icons, in `ink-muted`. While one of them is current, the parent's icon turns `brand`.
- **Section titles:** optional, 12/16 medium `ink-muted`, e.g. "Shop" or "Sales channels". Each titled section is a group named by its title.
- **Hover:** a `surface-sunken` fill.

## Counts

`badge` shows a number: orders to fulfil, or returns to check. Pair it with `badgeLabel` ("12 to fulfil"), so screen readers hear what the number means, not just "12". Show counts only for work waiting for someone. Totals are not counts.

## Items

`{ label, href, icon, current, badge, badgeLabel, items, expanded, key }`:

- `href` makes a link. Without it, the item is a button; the Nav emits `navigate` with the item.
- For a client-side router, listen to `navigate` and prevent the default.
- `icon` is an icon name or a node. Use it for top-level items only.

Pass `sections: [{ title?, items }]`, or `items` for a single section.

## Writing it

- Nouns, in the shop's own words: "Orders", "Products", "Customers", "Discounts".
- Keep the same order everywhere, with the most used first.
- Five to eight top-level items. More belong on a Settings page.

## What you provide

- `sections` (or `items`), and which item is `current`.
- An `aria-label` when there's more than one Nav. The default is "Main".
