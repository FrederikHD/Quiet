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

Background in the tone's tint, the icon in its strong colour, text in `ink`. Screen readers hear "Warning:" / "Error:" before warning and danger text.

## Anatomy

Icon · title (label weight) · text · actions (slim buttons or links) · optional × (`dismissible`, emits `dismiss`).

## Notice, Toast or field message?

- Something just happened → Toast.
- A field is wrong → the field's own error (and the Form's error summary).
- A state of the page or object that stays true → Notice.

## Keyboard and screen readers

A Notice is part of the page, not announced on its own. When it appears in response to something (after saving), it must be read out: pass `role="status"` (or `"alert"` for danger) to a notice that stays rendered while its text changes, or put the spot where it appears in a `role="status"` element that is on the page before the notice is (screen readers only announce changes inside a live region that already exists).

## Built from

Icon and Button (dismiss).

## What you provide

The tone, a short title that says what's going on, one sentence of what to do, and at most two actions.
