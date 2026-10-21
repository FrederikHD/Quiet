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

"I accept the terms" or "Track inventory" is a Checkbox on its own, not a group. `required` marks it as one that must be ticked, `error` shows the message under it, and an `id` links it from the Form's error summary (see Checkbox):

```vue
<QCheckbox
  id="terms"
  v-model="terms"
  required
  :error="tried && !terms ? 'Accept the terms to place your order' : null"
  label="I accept the terms and the cancellation policy"
/>
```

Keep CheckboxGroup for real sets of options.

## Layouts (`layout`)

- `list` (default): one option per row.
- `inline`: side by side, wrapping when space runs out. For 2–5 short options such as sizes or columns.
- `cards`: bordered tiles with a description and a `meta` (price). One per row by default; `:columns="2"` or `3` puts several per row, each at least 180px wide, so narrow screens drop back to fewer.
- `swatches` and `buttons`: colour dots and size tiles, for filters. See below.

## States

- **`error`:** unticked boxes (or unticked cards) turn `danger`, and the message shows under the group with an icon. Use it for "Choose at least one…".
- **`warning` / `success`:** a message only; the boxes stay as they are.
- **`disabled`:** disables every option. Say why in the `hint`.

## Values

- **`v-model`:** the ticked values, `['email', 'sms']`.
- **Without v-model:** `defaultValue` starts it; the group keeps its own state.
- **Neither:** each Checkbox manages itself (its own `v-model`). This suits a single checkbox.
- **`name`:** used for plain form posts; a name is generated when you don't pass one.
- **Form reset:** the group goes back to `defaultValue`. Without one, a reset leaves the value alone.

## Hidden label

`labelHidden` keeps the question for screen readers but hides it — as on Field — when a heading above already asks it. The options stay in the control column, lined up with the fields around them.

## Swatches and size tiles (filters)

`layout="swatches"` shows colour dots (`swatch` or `image` on each Checkbox) and `layout="buttons"` size tiles — the same look as RadioGroup's, but several can be on: a shop filter for colour and size. The chosen names show beside the group label ("Colour Navy, Sand"); give each option a `description` with its count ("4 products"), which screen readers read after the name, and disable options with nothing behind them. In a Disclosure, use `labelHidden` — the Disclosure title names the group.

## Keyboard and screen readers

- The group is a `group` named by its label (or `ariaLabel`): "group, Notify the customer by". Without a `label`, `ariaLabel` or `aria-labelledby` it has no group role, since an unnamed group tells screen readers nothing.
- Each option is a native checkbox: Tab moves from box to box, Space ticks and unticks.
- The hint and the message are tied to every checkbox, so they are read with each one. The message is a polite live region, announced when it appears; it stays quiet while the Form's error summary is showing.
- A required group around a single checkbox marks that checkbox `aria-required`.
- The chosen names beside the label (swatches and buttons) are hidden from screen readers; each tile already says whether it is ticked.

## What you provide

- **Required:** `label` ("Notify the customer by") — leave it out only for a single checkbox, or pass `ariaLabel` when something else on the page already says it.
- **Optional:** `layout` (`list` | `inline` | `cards` | `swatches` | `buttons`, default `list`), `columns` (cards only, default 1), `required`, `help`, `hint`, `error`, `warning`, `success`, `disabled`, `labelHidden`, `labelPlacement` (`auto` | `top` | `side`, default the Form's), `labelWidth` (default 200px), `markers` (`required` | `optional` | `none`, default the Form's), `id` (lands on the first enabled option), `name` (generated when missing), `defaultValue`, `ariaLabel`.
- **v-model:** `v-model` (the ticked values, `string[]`).
- **Slots:** the default slot (the Checkboxes, each with a `value` and a `label`), `#hint` (rich hint content instead of `hint`).
- **Translations:** `strings` — `optional` ("optional"), `help` ("Help"), `errorPrefix` ("Error:"), `warningPrefix` ("Warning:"), `successPrefix` (""); it overrides the Form's, or set them once with `configure({ strings: { form: … } })`.
