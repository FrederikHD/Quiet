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

Without a `#trigger` slot, the trigger is a ghost "⋯" icon button in `brand` green (`brand-hover` on hover, `brand-tint` behind it while open), named by `label`. Put your own Button in the `#trigger` slot as the child for a text trigger: `<Menu label="More actions" items={…}><Button iconEnd={<Icon name="chevron-down" />}>More actions</Button></Menu>`.

## Items

`{ label, icon, description, onSelect, href, danger, disabled, divider, key }` (the Menu also emits `select` with the item):

- **`icon`:** an icon name. Use icons on all items or on none.
- **`description`:** one short line under the label: "Hidden, kept in reports".
- **`danger`:** `danger` text, for destructive actions. Put them last, after a divider, and have them ask for confirmation in a Dialog.
- **`disabled`:** greyed out and does nothing. Say why in its `description` ("Locked once shipped").
- **`href`:** turns the item into a link.
- **`divider`:** a rule between groups.

## Keyboard and screen readers

- **Opening:** the button says it opens a menu (`aria-haspopup="menu"`) and whether it's open. Enter, Space or a click opens it, and focus moves to the first item.
- **Moving:** ↑ ↓ move (wrapping round), Home and End jump, and typing a letter jumps to the next item starting with it.
- **Choosing:** Enter, Space or a click chooses. The menu closes and focus goes back to the button, unless the action moved it (opened a dialog, went to another page).
- **Leaving:** Escape closes and returns to the button. Tab closes and moves on, because a menu is one Tab stop.

## When to use

- **Menu:** 2–8 actions that don't fit, or don't deserve, their own buttons.
- **Buttons:** the one or two actions people use most stay visible.
- **Select:** a menu runs actions; choosing a value is a Select.

## What you provide

- **Required:** `label` (names the menu and the "⋯" button: "Actions for #10530") and `items`.
- **Optional:** a trigger as the child, `align` (`end` by default, `start`), `variant` and `size` for the default trigger.
