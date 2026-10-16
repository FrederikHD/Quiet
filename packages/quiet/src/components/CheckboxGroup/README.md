# CheckboxGroup

A form field for a set of checkboxes: a question with several independent answers, any number of which can be ticked — or none. "Notify the customer by", "Sell on", "Show columns", "Gift options".

It is to Checkbox what Field is to Input. You put `<QCheckbox>`es inside, and the group adds everything a form field needs:

- The visible question (`label`), which also names the set for screen readers ("group, Notify the customer by").
- Label placement, which follows the Form: above, or beside from 400/520px, lined up with the first option.
- The required or optional marker, a `help` tip, a `hint`, and an `error` / `warning` / `success` message. The message is read with every checkbox in the group.
- The value: one array with the ticked options' values.
- An `id` for the Form's error-summary link, which lands on the first option.

```vue
<QCheckboxGroup v-model="channels" label="Notify the customer by" hint="Only for this order.">
  <QCheckbox value="email" label="Email" description="Order confirmation and shipping updates" />
  <QCheckbox value="sms" label="Text message" />
</QCheckboxGroup>
```

## When to use

- **CheckboxGroup:** 2 to about 10 options that don't exclude each other.
- **Combobox with `multiple`:** more than about 10 options, or options people search for (products, customers).
- **RadioGroup:** exactly one of the options.

## A single checkbox

"I accept the terms" or "Track inventory" is a CheckboxGroup **without a label** around one Checkbox. It keeps the hint, the error message and the summary link. With labels beside, it lines up with the other controls. If the group is `required`, the checkbox itself is marked required for screen readers.

```vue
<QCheckboxGroup id="terms" required :error="tried && !terms ? 'Accept the terms to place your order' : null">
  <QCheckbox v-model="terms" value="yes" label="I accept the terms and the cancellation policy" />
</QCheckboxGroup>
```

## Layouts (`layout`)

- `list` (default): one option per row.
- `inline`: side by side, wrapping when space runs out. For 2–5 short options such as sizes or columns.
- `cards`: bordered tiles with a description and a `meta` (price). One per row by default; `:columns="2"` or `3` puts several per row, each at least 180px wide, so phones drop back to fewer.

## States

- **`error`:** unticked boxes (or unticked cards) turn `danger`, and the message shows under the group with an icon. Use it for "Choose at least one…".
- **`warning` / `success`:** a message only; the boxes stay as they are.
- **`disabled`:** disables every option. Say why in the `hint`.

## Values

- **`v-model`:** the ticked values, `['email', 'sms']`.
- **Without v-model:** `default-value` starts it; the group keeps its own state.
- **Neither:** each Checkbox manages itself (its own `v-model`). This suits a single checkbox.
- **`name`:** used for plain form posts; a name is generated when you don't pass one.
- **Form reset:** the group goes back to `default-value`.

## Hidden label

`labelHidden` keeps the question for screen readers but hides it — as on Field — when a heading above already asks it. The options stay in the control column, lined up with the fields around them.

## Swatches and size tiles (filters)

`layout="swatches"` shows colour dots (`swatch` on each Checkbox) and `layout="buttons"` size tiles — the same look as RadioGroup's, but several can be on: a shop filter for colour and size. The chosen names show beside the group label ("Colour  Navy, Sand"); give each option a `description` with its count ("4 products") for screen readers, and disable options with nothing behind them. In a Disclosure, use `labelHidden` — the Disclosure title names the group.

## What you provide

- **`label`:** the question. Leave it out only for a single checkbox, or pass `aria-label` when something else on the page already says it.
- **Children:** Checkboxes, each with a `value` and a `label`.
- **Optional:** `layout`, `columns`, `required`, `hint`, `help`, `error`, `warning`, `success`, `disabled`, `id`, `name`, `labelPlacement`, `labelWidth`.
