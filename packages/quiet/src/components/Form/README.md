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
- Browser validation bubbles are off (`noValidate`), so errors look the same everywhere.

## Writing it

Pass `strings` to translate the built-in words: `optional`, `help`, `errorPrefix`, `warningPrefix`, `errorSummaryTitle`. German: `{ optional: 'optional', help: 'Hilfe', errorPrefix: 'Fehler:', warningPrefix: 'Hinweis:', errorSummaryTitle: 'Bitte korrigieren Sie Folgendes' }`. Or set them once for the shop: `configure({ strings: { form: { … } } })`.

## What you provide

`@submit` (use `@submit.prevent` unless you want a native post), the fields and sections, a FormActions bar, and the `errors` list after a failed submit. Other `<form>` attributes pass through.
