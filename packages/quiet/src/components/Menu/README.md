# Menu

A button that opens a short list of actions. Use it for the "⋯" on a table row or card, or for "More actions ▾" next to a page's main buttons.

```vue
<QMenu
  label="Actions for Linen shirt, blue"
  :items="[
    { label: 'Edit', icon: 'pencil', onSelect: edit },
    { label: 'Duplicate', icon: 'copy', onSelect: duplicate },
    { divider: true },
    { label: 'Delete', icon: 'trash', danger: true, onSelect: askToDelete },
  ]"
/>
```

Without a `#trigger` slot, the trigger is a "⋯" icon button (ghost by default; set `variant` and `size`) in `brand` green (`brand-hover` on hover, `brand-tint` behind it while open), named by `label`. For a text trigger, put your own Button in the `#trigger` slot: `<QMenu label="More actions" :items="items"><template #trigger><QButton icon-end="chevron-down">More actions</QButton></template></QMenu>`. To show more than text in an item's label, use the `#item="{ item }"` slot; the icon and description stay. Attributes you set on the Menu (`class`, `data-*`) go to the default trigger.

## Items

`{ label, icon, description, onSelect, href, danger, disabled, divider, key }`. `onSelect(event)` is called when the item is chosen, and the Menu also emits `@select(item, event)`. `null` and `false` entries are skipped, so `cond && { … }` leaves an item out.

- **`icon`:** an icon name. Use icons on all items or on none.
- **`description`:** one short line under the label: "Hidden, kept in reports".
- **`danger`:** `danger` text, for destructive actions. Put them last, after a divider, and have them ask for confirmation in a Dialog.
- **`disabled`:** `ink-muted` text, skipped by the arrow keys, and choosing it does nothing (the menu stays open). Say why in its `description` ("Locked once shipped").
- **`href`:** turns the item into a link, for navigation instead of an action.
- **`divider`:** a rule between groups; its other fields are ignored.
- **`key`:** a stable key for the list (default: the index).

## Keyboard and screen readers

- **Opening:** the button says it opens a menu (`aria-haspopup="menu"`) and whether it's open (`aria-expanded`). Enter, Space or a click opens it, and focus moves to the first item. The list is `role="menu"`, named by `label`; items are `role="menuitem"`, dividers `role="separator"`, disabled items `aria-disabled="true"`.
- **Moving:** ↑ ↓ move (wrapping round), Home and End jump, and typing a letter jumps to the next item starting with it. Disabled items are skipped.
- **Choosing:** Enter, Space or a click chooses. The menu closes and focus goes back to the button, unless the action moved it (opened a dialog, went to another page).
- **Leaving:** Escape closes and returns to the button. Tab closes and moves to whatever follows the button; Shift+Tab closes and returns to the button, because a menu is one Tab stop. A click outside closes it too.

## When to use

- **Menu:** 2–8 actions that don't fit, or don't deserve, their own buttons.
- **Buttons:** the one or two actions people use most stay visible.
- **Select:** a menu runs actions; choosing a value is a Select.

## What you provide

- **Required:** `label` (names the menu and the "⋯" button: "Actions for #10530"), `items`.
- **Optional:** `align` (`start` | `end`, default `end`), `variant` (`secondary` | `ghost`, default `ghost`) and `size` (`slim` | `default` | `large`, default `default`) for the default trigger.
- **Events:** `@select(item, event)` when an item is chosen.
- **Slots:** `#trigger` (your own Button instead of "⋯"), `#item="{ item }"` (an item's label line).
