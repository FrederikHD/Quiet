# Notice

A message that stays on the page until it no longer applies: "Payment pending — the customer hasn't paid yet", "3 products are out of stock", "Example shop: nothing is charged".

```vue
<QNotice tone="warning" title="3 products are out of stock">
  They're hidden from the shop until you restock them.
  <template #actions><QButton size="slim" href="#inventory">Inventory</QButton></template>
</QNotice>
```

## Tones

- **info** — context people should know ("Example shop: nothing is charged").
- **success** — a state that's good and lasting ("Shop is live").
- **warning** — something needs attention soon ("Payment pending").
- **danger** — something is wrong and blocks ("Payment failed — the order won't ship").

Background in the tone's tint, the icon in its strong colour, text in `ink`. Screen readers hear "Warning:" / "Error:" before warning and danger text. `icon` replaces the tone's own icon. An unknown tone falls back to `info`.

## Anatomy

Icon (20px) · title (semibold; `title` or the `#title` slot) · text (13px) · actions (`#actions`: slim buttons or links) · optional × (`dismissible`, emits `@dismiss`; you remove the notice).

## Notice, Toast or field message?

- Something just happened → Toast.
- A field is wrong → the field's own error (and the Form's error summary).
- A state of the page or object that stays true → Notice.

## Keyboard and screen readers

The icon is hidden from screen readers; the hidden "Warning:" / "Error:" prefix goes before the title, or before the text when there's no title. The × is a button named "Dismiss". A Notice is part of the page, not announced on its own. When it appears in response to something (after saving), it must be read out: pass `role="status"` (or `"alert"` for danger) to a notice that stays rendered while its text changes, or put the spot where it appears in a `role="status"` element that is on the page before the notice is (screen readers only announce changes inside a live region that already exists). When you remove a notice after `@dismiss`, its × goes with it, so move focus to a sensible next element yourself — the heading or content the notice sat above.

## Built from

Icon and Button (dismiss).

## What you provide

Write a short title that says what's going on, one sentence of what to do, and at most two actions.

- **Optional:** `tone` (`info` | `success` | `warning` | `danger`, default `info`), `title`, `dismissible`, `icon`, `role` (`status` | `alert`; none by default).
- **Events:** `@dismiss` (the × was pressed).
- **Slots:** the default slot (the text), `#title` (in place of `title`), `#actions`.
- **Translations:** `strings` — `dismiss` ("Dismiss") and `prefix` (`{ warning: 'Warning:', danger: 'Error:' }`); or once for the shop with `configure({ strings: { notice: … } })`.
