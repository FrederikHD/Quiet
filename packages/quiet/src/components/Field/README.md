# Field

Wraps one control with its label, an optional help tip, a visible hint and an error, warning or success message — and wires them together for screen readers.

## Anatomy

1. **Label** — `label` style, `ink`. Always present; `labelHidden` hides it visually only, for a search box whose purpose is obvious.
2. **Marker** — asterisk or "(optional)", set by the Form's `markers` or the Field's own.
3. **Help** — `help` puts a `help` icon after the label that opens a Popover tip. For background ("What is a SKU?"), never for something people need in order to answer. The button is 24px with a 16px `brand` icon (`brand-hover` on hover, `brand-tint` behind it while the tip is open) on every screen, with an invisible 40px touch area, so it never makes the label row taller; a long label wraps its own text and the icon stays on the line beside it.
4. **Control** — exactly one control in the default slot: Input, Textarea, Select, Combobox or QuantityStepper, or a native control. Sets of checkboxes or radios use CheckboxGroup or RadioGroup instead, which are fields themselves.
5. **Message** — `error`, `warning` or `success`, with its icon, under the control. Only one shows; error wins.
6. **Hint** — `hint`, `ink-muted`, under the message: the format, a limit, where the value appears. Visible, so nobody has to open anything to find it.

## Messages and states

| Prop       | Colour and icon           | Control                    | Use for                                                                          |
| ---------- | ------------------------- | -------------------------- | -------------------------------------------------------------------------------- |
| `error`    | `danger`, alert-circle    | red border, `aria-invalid` | Blocks saving: missing, wrong format, out of range                               |
| `warning`  | `warning`, alert-triangle | unchanged                  | Allowed but worth a second look: price below cost, stock below the reorder level |
| `success`  | `success`, check-circle   | unchanged                  | A check that ran and passed: discount code applied, address verified             |
| `hint`     | `ink-muted`, no icon      | unchanged                  | Always-on guidance                                                               |
| `disabled` | label `ink-muted`         | disabled                   | Not editable now; say why in the hint                                            |
| `readonly` | —                         | read-only                  | Shown and copyable, never editable: order number, created date                   |

Messages sit in a live region, so one that appears after a check is announced. Screen readers hear "Error:" or "Warning:" before the text — translate with `strings`.

Each of `label`, `help` and `hint` has a slot of the same name for rich content (a link in the hint, say).

## Label placement

The Form sets `labelPlacement` for every field; `labelPlacement` on a Field overrides it for that field.

- **auto** (default) — the label sits above the control until the field is 520px wide, then beside it. Measured per field, not per screen.
- **top** — always above.
- **side** — beside from 400px wide, above below that.

A label beside the control takes `labelWidth` (default 200px, or the Form's), but never more than 40% of the field. Inside a FieldGroup the label is always on top.

## In a FieldGroup

Fields in a row share their row lines: labels line up at the bottom and controls at the top, even when one label wraps to two lines, so the inputs always sit level.

## Width

`width` limits the control to the length of the expected answer — `xs` (6rem) quantity or house number, `s` (10rem) price or postcode, `m` (20rem) name or SKU, `l` (30rem) email or URL. A field the length of its answer is quicker to fill in; leave long text full width.

## Keyboard and screen readers

Wired for you:

- The control gets the Field's `id` (yours, else the control's own, else a generated one). The label's `for` points at it, so the control is named by the label and clicking the label focuses it.
- `aria-describedby` points at the message first, then the hint, then the FieldGroup's message and hint when the Field is in one.
- `required` gives the control `aria-required`, so screen readers say "required" whatever the marker. The asterisk itself is hidden from them.
- An error marks the control invalid (`aria-invalid`), as does an error on the surrounding FieldGroup.
- The message area is a polite live region, so a message that appears later is read out, with "Error:" or "Warning:" before it. While the Form's error summary is showing, the live region is off: the summary already announced the errors.
- The help icon is a button named "Help: <label>" in the tab order. Enter or Space opens the tip; focus stays on the button and the tip's text is read. Escape or tabbing away closes it.

## What you provide

- **Required:** `label` ("Email", or the `#label` slot), exactly one control in the default slot.
- **Optional:** `hint`, `help`, `error`, `warning`, `success` (error wins), `required`, `disabled`, `readonly`, `width` (`xs` | `s` | `m` | `l`; default full width), `labelHidden`, `id` (to link the field from the Form's error summary), `labelPlacement` (`auto` | `top` | `side`; default the Form's, else `auto`), `labelWidth` (default the Form's, else 200px), `markers` (`required` | `optional` | `none`; default the Form's, else `required`).
- **Slots:** the default slot (the control; slot props `{ controlAttrs, id, invalid }`), `#label`, `#help`, `#hint`.
- **Translations:** `strings` — `optional` ("optional"), `help` ("Help"), `errorPrefix` ("Error:"), `warningPrefix` ("Warning:"), `successPrefix` (""), `errorSummaryTitle`. Overrides the Form's; or set them once with `configure({ strings: { form: { … } } })`.

Quiet controls wire themselves up. For a native control, bind the slot's `controlAttrs`:

```vue
<QField label="Note" v-slot="{ controlAttrs }">
  <textarea v-bind="controlAttrs" />
</QField>
```
