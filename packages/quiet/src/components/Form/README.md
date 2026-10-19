# Form

The outer `<form>`: sets label placement, markers, density and wording for every field inside, and shows an error summary at the top after a failed submit.

## Structure

```vue
<QForm label-placement="auto" :errors="errors" @submit.prevent="save">
  <QFormSection title="Product details">
    <QField label="Title" required :error="titleError"><QInput v-model="title" /></QField>
    <QFieldGroup label="Price" :columns="[1, 1]">
      <QField label="Price"><QInput v-model="price" suffix="€" numeric align="end" /></QField>
      <QField label="Compare-at price"><QInput v-model="compareAt" suffix="€" numeric align="end" /></QField>
    </QFieldGroup>
  </QFormSection>
  <QFormActions><QButton>Cancel</QButton><QButton variant="primary" type="submit">Save</QButton></QFormActions>
</QForm>
```

Fields stack `--field-gap` apart (16 comfortable, 12 compact); sections are separated by a `line` rule and `space-6`.

## Label placement

- **auto** (default) — each field puts its label above itself until it is 520px wide, then beside it. It measures the space the field actually has, not the screen, so the same form stacks in a narrow side panel on a wide monitor and on a phone.
- **top** — always above. Storefront checkout, sign-up, anything mostly used on phones, and every form with long labels.
- **side** — beside whenever the field is at least 400px wide; below that it falls back to above, because no layout can fit a label beside a usable control on a phone. Dense back-office edit screens where many short fields are scanned top to bottom.
- The label column is `labelWidth` (default 200px) but never more than 40% of the field, so it gives way before the control gets cramped.
- Override per field or group with `labelPlacement`. Fields inside a FieldGroup always have their labels on top.

## Required and optional markers

- `markers="required"` (default) puts a `danger` asterisk on required fields — back-office forms where most fields are optional.
- `markers="optional"` adds "(optional)" to optional fields instead — checkout and sign-up, where most fields are required.
- Either way the control gets `aria-required`, so screen readers say "required" whatever the marker.

## Validation and the error summary

- Validate on submit, and again on blur only for fields that already showed an error. Don't validate while someone is still typing.
- After a failed submit, pass every error to `errors` (`{ id, message }`, id = the control's id, or a FieldGroup's / choice group's id to land on its first control) **and** to each Field's `error`. The summary lists them as links that jump to the field; focus moves to the summary so keyboard and screen-reader users hear what's wrong.
- Write each message once and reuse it in both places: say what's wrong and how to fix it — "Enter a price, like 49,90", not "Invalid input".
- An error without an `id` is listed as plain text, not a link.
- Live validation that rebuilds `errors` while people type: set `:focus-error-summary="false"` so focus stays in the field.
- Browser validation bubbles are off (`noValidate`, default true), so errors look the same everywhere.

## Density

`density` (`comfortable` | `compact`) sets `data-density` on the form, so the fields and controls inside take that size. Without it the form inherits the density around it. Fields stack 16px apart in comfortable, 12px in compact.

## Keyboard and screen readers

- The error summary shows at the top of the form whenever `errors` has entries. After each submit that leaves errors, and when errors first appear (from the server, say), focus moves to the summary and it scrolls into view. It is a region named by its title ("Please fix the following"), so screen readers read the title and the list. Focus doesn't move again while people correct the errors and the list shrinks.
- Each error with an `id` is a link. Enter moves focus to that control and scrolls it to the middle of the screen; an `id` on a FieldGroup or choice group lands on its first control. A control in a closed Tabs panel opens its tab first.
- With `focusErrorSummary` false the summary takes `role="alert"` instead, so it is announced without moving focus.
- While the summary shows, the Fields' own messages stop announcing, so nothing is read twice. They still show and stay linked to their controls by `aria-describedby`.

## Writing it

Pass `strings` to translate the built-in words: `optional`, `help`, `errorPrefix`, `warningPrefix`, `successPrefix`, `errorSummaryTitle`. German: `{ optional: 'optional', help: 'Hilfe', errorPrefix: 'Fehler:', warningPrefix: 'Hinweis:', errorSummaryTitle: 'Bitte korrigieren Sie Folgendes' }`. Or set them once for the shop: `configure({ strings: { form: { … } } })`.

## What you provide

- **Required:** the fields, sections and a FormActions bar in the default slot.
- **Optional:** `errors` (`{ id?, message }[]`, after a failed submit), `labelPlacement` (`auto` | `top` | `side`; default `auto`), `labelWidth` (default 200px), `markers` (`required` | `optional` | `none`; default `required`), `density` (`comfortable` | `compact`; default inherited), `focusErrorSummary` (default true), `noValidate` (default true). Other `<form>` attributes pass through.
- **Events:** `@submit(event)` — use `@submit.prevent` unless you want a native post.
- **Slots:** the default slot (the form's content).
- **Translations:** `strings` — `optional` ("optional"), `help` ("Help"), `errorPrefix` ("Error:"), `warningPrefix` ("Warning:"), `successPrefix` (""), `errorSummaryTitle` ("Please fix the following"); or `configure({ strings: { form: { … } } })`.
