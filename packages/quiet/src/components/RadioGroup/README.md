# RadioGroup

A form field for a question with exactly one answer out of 2–5 options, all visible at once: delivery method, payment method, product status, return reason.

It is to Radio what Field is to Input. You put `<QRadio>`s inside, and the group adds:

- The question (`label`), announced as "radio group, Delivery".
- Label placement, which follows the Form: above, or beside from 400/520px, lined up with the first option (or the first card).
- The required or optional marker, a `help` tip, a `hint`, and an `error` / `warning` / `success` message, read with every option.
- The value: the chosen Radio's `value`, or `null` when nothing is chosen yet.
- An `id` for the Form's error-summary link, which lands on the chosen option or the first one.
- The shared `name`, and arrow-key movement between the options.

```vue
<QRadioGroup v-model="ship" label="Delivery" layout="cards" required :error="err">
  <QRadio value="std" label="Standard" description="2–4 working days" meta="Free" />
  <QRadio value="exp" label="Express" description="Next working day" meta="9,90 €" />
</QRadioGroup>
```

## When to use

- **RadioGroup:** 2–5 options people should see and compare before choosing.
- **Select:** 4–15 options people recognise without comparing them (country, sort order), or when space is tight.
- **CheckboxGroup:** any number of the options can be chosen.

**Default or empty?**

- Preselect the most common answer when there is one, such as product status "Active".
- Leave it empty (`null`) when the choice is the customer's to make, such as payment, or delivery options at different prices. Mark it `required` and show an `error` if they submit without choosing.

## Layouts (`layout`)

- `list` (default): one option per row.
- `inline`: side by side, wrapping. Up to 3 short options, such as Slim / Regular / Relaxed or CSV / Excel / PDF.
- `cards`: bordered tiles with a description and a price. Use it for delivery and payment in checkout. A radio's `media` puts a small picture before the text — a payment method's icon or logo (it's decorative; the label carries the name). One per row by default; `columns` puts several per row, each at least 180px wide.
- `swatches`: colour dots for a product's colours. Give each Radio a `swatch` colour (or an `image` of the fabric). The chosen colour's name shows next to the question ("Colour Navy"), and each dot shows its name on hover.
- `buttons`: size tiles (XS · S · M · L), chosen = `brand` border on `brand-tint`. For short options: sizes, lengths, pack sizes.

**Sold out** (`soldOut` on a Radio, in `swatches` and `buttons`): crossed out but still choosable, and read as "XL, sold out" — so people can pick it and be offered "Notify me" instead of Add to cart. Use `disabled` only for options that can't be chosen at all. Swatch and size tiles are 40px tap targets (32px compact, 48px on phones).

## States

- **`error`:** unchosen options turn `danger`, and the message shows under the group. Use it for "Choose a delivery method".
- **`warning` / `success`:** a message only.
- **`disabled`:** disables every option. To disable one option, set `disabled` on that Radio and say why in its `description`.

**Form reset** puts the group back to `defaultValue`, or to `null` without one.

## Writing it

- The label asks the question or names the choice: "Delivery", "Return reason".
- Keep the options short and parallel. Details go in `description`, the price in `meta`.
- Order the options by what most people pick, or from cheapest to fastest — not alphabetically.

## Hidden label

`labelHidden` keeps the question for screen readers but hides it — as on Field — when a heading above already asks it. The options stay in the control column, lined up with the fields around them.

## Keyboard and screen readers

- The group is a `radiogroup` named by its label (or `ariaLabel`): "radio group, Delivery". It carries `aria-required` when `required`, and `aria-invalid` while it has an `error`.
- The options are native radios sharing one `name`: Tab enters the set on the chosen option (or the first) and leaves it in one step; ↑ ↓ ← → move and choose, skipping disabled options.
- The hint and the message are tied to every option, so they are read with each one. The message is a polite live region, announced when it appears; it stays quiet while the Form's error summary is showing.
- The chosen name beside the label (swatches and buttons) is hidden from screen readers; the chosen tile already says so.

## What you provide

- **Required:** `label` ("Delivery"), or `ariaLabel` when something else on the page already asks the question.
- **Optional:** `layout` (`list` | `inline` | `cards` | `swatches` | `buttons`, default `list`), `columns` (cards only, default 1), `required`, `help`, `hint`, `error`, `warning`, `success`, `disabled`, `labelHidden`, `labelPlacement` (`auto` | `top` | `side`, default the Form's), `labelWidth` (default 200px), `markers` (`required` | `optional` | `none`, default the Form's), `id` (lands on the chosen option, or the first enabled one), `name` (generated when missing), `defaultValue` (starts the value without v-model; a form reset goes back to it).
- **v-model:** `v-model` (the chosen Radio's `value`, or `null` for none yet).
- **Slots:** the default slot (the Radios, each with a `value` and a `label`, plus `swatch` or `image` and `soldOut` in the tile layouts), `#hint` (rich hint content instead of `hint`).
- **Translations:** `strings` — `optional` ("optional"), `help` ("Help"), `errorPrefix` ("Error:"), `warningPrefix` ("Warning:"), `successPrefix` (""); it overrides the Form's, or set them once with `configure({ strings: { form: … } })`. The "sold out" word comes from `configure({ strings: { choice: { soldOut } } })`.
