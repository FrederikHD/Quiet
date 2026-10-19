# Nav

The back-office navigation: sections of links with icons, counts, the current page, and sub-pages. It lives in an AppShell.

## Anatomy

- **Items:** an icon (`ctl-icon`, `ink-muted`), the label in medium weight, and an optional count badge on the right. Each top-level item is as tall as a control (40px comfortable, 32px compact) and has `radius-md`. A long label is cut off with an ellipsis.
- **Current page:** `brand-tint` fill with `brand` text and icon, in semibold, plus `aria-current="page"`.
- **Sub-pages:** shown under their parent while the parent or one of them is current (or `expanded`). They're 8px shorter, indented to the label, without icons, in regular weight and `ink-muted`. While one of them is current, the parent's icon turns `brand`.
- **Section titles:** optional, 12/16 medium `ink-muted`, e.g. "Shop" or "Sales channels". Each titled section is a group named by its title.
- **Hover:** a `surface-sunken` fill.

## Counts

`badge` shows a number: orders to fulfil, or returns to check. Pair it with `badgeLabel` ("12 to fulfil"): screen readers then hear "Orders, 12 to fulfil" instead of "Orders 12". Show counts only for work waiting for someone. Totals are not counts.

## Items

`{ label, href, icon, current, badge, badgeLabel, items, expanded, key }`:

- `href` makes a link. Without it, the item is a button. Either way the Nav emits `@navigate(item, event)` on click.
- For a client-side router, listen to `@navigate` and call `event.preventDefault()` on links (or leave out `href`).
- `icon` is an icon name, shown on top-level items only.
- `items` are sub-pages. `expanded` forces them open (`true`) or closed (`false`); by default they show while the item or one of them is `current`.
- `key` tells items apart (default: `href`, else the index).

Pass `sections: [{ title?, items }]`, or `items` for a single section without a title.

```vue
<QNav
  :sections="[
    { items: [{ label: 'Home', href: '/', icon: 'home', current: true }] },
    { title: 'Shop', items: [{ label: 'Orders', href: '/orders', icon: 'package', badge: 12, badgeLabel: '12 to fulfil' }] },
  ]"
  @navigate="onNavigate"
/>
```

## Writing it

- Nouns, in the shop's own words: "Orders", "Products", "Customers", "Discounts".
- Keep the same order everywhere, with the most used first.
- Five to eight top-level items. More belong on a Settings page.

## Keyboard and screen readers

- The Nav is a `nav` landmark named "Main" (`strings.nav`). With more than one Nav on a page, give each its own name with `aria-label` (it wins over `strings`).
- A titled section is a `role="group"` named by its title.
- Items are ordinary links (or buttons without `href`): Tab moves through them, Enter follows them. Sub-pages are only in the Tab order while they're shown; there is no expand/collapse control.
- The current page has `aria-current="page"`. Icons are hidden from screen readers. With `badgeLabel`, the badge number is hidden and ", 12 to fulfil" is read after the label instead.

## What you provide

- **Optional:** `sections` (`[{ title?, items }]`) or `items` (a single section), and which item is `current`.
- **Events:** `@navigate(item, event)` when an item is clicked.
- **Translations:** `strings` — `nav` ("Main", the landmark's name). Or set it once with `configure({ strings: { shell: { nav: 'Hauptmenü' } } })`, the namespace AppShell uses.
