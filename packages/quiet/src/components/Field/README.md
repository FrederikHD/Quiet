# Field

Wraps one control with its label, an optional help tip, a visible hint and an error, warning or success message — and wires them together for screen readers.

## Anatomy

1. **Label** — `label` style, `ink`. Always present; `labelHidden` hides it visually only, for a search box whose purpose is obvious.
2. **Marker** — asterisk or "(optional)", set by the Form's `markers`.
3. **Help** — `help` puts a `help` icon after the label that opens a Popover tip. For background ("What is a SKU?"), never for something people need in order to answer. The button is 24px with a 16px `brand` icon (`brand-hover` on hover, `brand-tint` behind it while the tip is open) on every screen, with an invisible 40px touch area, so it never makes the label row taller; a long label wraps its own text and the icon stays on the line beside it.
4. **Control** — exactly one child: Input, Select or Combobox, or a native control. Sets of checkboxes or radios use CheckboxGroup or RadioGroup instead, which are fields themselves.
5. **Message** — `error`, `warning` or `success`, with its icon, under the control. Only one shows; error wins.
6. **Hint** — `hint`, `ink-muted`, under the message: the format, a limit, where the value appears. Visible, so nobody has to open anything to find it.

## Messages and states

| Prop | Colour and icon | Control | Use for |
| --- | --- | --- | --- |
| `error` | `danger`, alert-circle | red border, `aria-invalid` | Blocks saving: missing, wrong format, out of range |
| `warning` | `warning`, alert-triangle | unchanged | Allowed but worth a second look: price below cost, stock below the reorder level |
| `success` | `success`, check-circle | unchanged | A check that ran and passed: discount code applied, address verified |
| `hint` | `ink-muted`, no icon | unchanged | Always-on guidance |
| `disabled` | label `ink-muted` | disabled | Not editable now; say why in the hint |
| `readonly` | — | read-only | Shown and copyable, never editable: order number, created date |

Messages sit in a live region, so one that appears after a check is announced. Screen readers hear "Error:" or "Warning:" before the text — translate with `strings`.

## In a FieldGroup

Fields in a row share their row lines: labels line up at the bottom and controls at the top, even when one label wraps to two lines, so the inputs always sit level.

## Width

`width` limits the control to the length of the expected answer — `xs` (6rem) quantity or house number, `s` (10rem) price or postcode, `m` (20rem) name or SKU, `l` (30rem) email or URL. A field the length of its answer is quicker to fill in; leave long text full width.

## Keyboard and screen readers (wired for you)

The control gets `id` (yours, or generated), `aria-describedby` pointing at the message and hint, `aria-required` when `required`, and `invalid` (Quiet controls) or `aria-invalid` (others) when there's an error. The label's `for` points at the control, so clicking the label focuses it.

## What you provide

`label`, exactly one control in the default slot, and whichever of `hint`, `help`, `error`, `warning`, `success`, `required`, `disabled`, `readonly`, `width` apply. Quiet controls wire themselves up; for a native control bind the slot's `controlAttrs`: `<QField label="Note" v-slot="{ controlAttrs }"><textarea v-bind="controlAttrs" /></QField>`. Pass `id` when the Form error summary needs to link to the field.
