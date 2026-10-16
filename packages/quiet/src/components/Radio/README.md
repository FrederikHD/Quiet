# Radio

One option in a set where exactly one can be chosen. A Radio always sits inside a RadioGroup: the group names the question, holds the value and makes the arrow keys move between the options.

## Radio or RadioGroup?

- **Radio** is a single option: the circle, its label, and an optional description and price.
- **RadioGroup** is the form field around the options: the question ("Delivery"), the chosen value, the layout, and the hint and error messages.
- Always use both. A Radio outside a RadioGroup logs a console warning.

## Anatomy

- **Circle:** 18px (16px compact), 1px `line-strong` border on `surface-raised`.
- **Chosen:** `brand` fill with a white centre.
- **Label:** the control text size, 12px to the right.
- **`description`** (optional): 13/18, `ink-muted`.
- **`meta`** (optional): right-aligned and tabular, usually the price ("Free", "9,90 €").
- **Row height:** as tall as a control (40px, 32px compact), and the whole row is the click target.

## States

- **Not chosen / chosen:** set by the group's value.
- **Disabled:** `disabled` on one option, or on the whole group. Put the reason in the `description` ("Has open orders").
- **Invalid:** when the group has an `error`, unchosen circles (or unchosen cards) turn `danger` until one is chosen.
- **Focus:** a 2px `brand` ring 2px outside the circle, or around the whole card. It is `danger` while the group has an error.
- **Card:** inside `<RadioGroup layout="cards">`, each option is a bordered tile; the chosen one gets a `brand` border and `brand-tint`.

## Keyboard and screen readers

Native radios:

- Tab enters the set on the chosen option, or the first one, and leaves it in one step.
- ↑ ↓ ← → move and choose, skipping disabled options.
- Each option is read as "radio button, 2 of 3", with its description and the group's message.

## Card pictures

In a `layout="cards"` group, `media` shows a small picture before the label — the card or invoice icon of a payment method, or a carrier logo. It is hidden from screen readers, so the label must still say what the option is.

## What you provide

- **Required:** `value` and `label`.
- **Optional:** `description`, `meta`, `disabled`.
- **In a `swatches` or `buttons` group:** `swatch` (a CSS colour) or `image` (a fabric picture) for the dot, and `soldOut`.
