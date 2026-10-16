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

**Sold out** (`soldOut` on a Radio, in `swatches` and `buttons`): crossed out but still choosable, and read as "XL, sold out" — so people can pick it and be offered "Notify me" instead of Add to cart. Use `disabled` only for options that can't be chosen at all. Swatch and size tiles are 40px (48px on phones) tap targets.

## States

- **`error`:** unchosen options turn `danger`, and the message shows under the group. Use it for "Choose a delivery method".
- **`warning` / `success`:** a message only.
- **`disabled`:** disables every option. To disable one option, set `disabled` on that Radio and say why in its `description`.

## Writing it

- The label asks the question or names the choice: "Delivery", "Return reason".
- Keep the options short and parallel. Details go in `description`, the price in `meta`.
- Order the options by what most people pick, or from cheapest to fastest — not alphabetically.

## Hidden label

`labelHidden` keeps the question for screen readers but hides it — as on Field — when a heading above already asks it. The options stay in the control column, lined up with the fields around them.

## What you provide

- **`label`**, or `aria-label` when something else on the page already asks the question.
- **Children:** Radios, each with a `value` and a `label` (plus `swatch` or `image`, and `soldOut`, in the tile layouts).
- **Value:** `v-model`, or `default-value` to start it without one.
- **Optional:** `layout`, `columns`, `required`, `hint`, `help`, `error`, `warning`, `success`, `disabled`, `id`, `name`, `labelPlacement`, `labelWidth`.
