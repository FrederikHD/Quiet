# Forms

Most screens in a shop are forms: checkout, sign-up, editing a product. Quiet's form components handle the labels, messages and focus, so that everyone can fill in a form and fix it. This guide puts them together. Each component's page has the details.

## The parts

- **`QForm`**: the `<form>`. Sets label placement and markers for everything inside, and shows the error summary.
- **`QFormSection`**: a titled group of fields ("Shipping", "Pricing").
- **`QField`**: one label, one control, and its hint, help and message. Every control goes in one.
- **`QFieldGroup`**: fields that belong together on one row (price and compare-at price; postcode and city).
- **Controls**: `QInput`, `QTextarea`, `QSelect`, `QCombobox`, `QQuantityStepper`, `QFileUpload`, `QPriceRange`, `QRatingInput`. `QCheckboxGroup` and `QRadioGroup` are fields themselves, with their own label and message.
- **`QFormActions`**: the buttons at the end. `sticky` keeps Save in reach on long screens.

```vue
<QForm :errors="summary" @submit.prevent="save">
  <QFormSection title="Details">
    <QField id="title" label="Title" required :error="shown.title">
      <QInput v-model="draft.title" />
    </QField>
    <QFieldGroup label="Price" label-hidden :columns="[1, 1]">
      <QField id="price" label="Price" required :error="shown.price">
        <QInput v-model="draft.price" suffix="€" numeric align="end" inputmode="decimal" />
      </QField>
      <QField label="Compare-at price">
        <QInput v-model="draft.compareAt" suffix="€" numeric align="end" inputmode="decimal" />
      </QField>
    </QFieldGroup>
  </QFormSection>
  <QFormActions>
    <QButton>Cancel</QButton>
    <QButton variant="primary" type="submit">Save</QButton>
  </QFormActions>
</QForm>
```

## Labels and markers

- Every field needs a `label`, even when it isn't shown: `label-hidden` keeps it for screen readers. A field without one warns in development.
- `labelPlacement` on the Form: `auto` (the default) puts labels beside fields that have room and above the rest; `top` for checkout, sign-up and anything mostly used on phones.
- `markers="required"` (the default) puts an asterisk on required fields, for back-office forms where most fields are optional. `markers="optional"` adds "(optional)" to the others instead, for checkout and sign-up, where most are required.
- `hint` is a line under the field ("Shown on the product page"). `help` is a button that opens a longer explanation. Use them for what people need to fill it in, not to repeat the label.

## Validation

Check on submit, not while people type. Then, once a field has shown an error, check again as it changes, so the message goes away when it's fixed.

```ts
import { computed, ref } from 'vue';
import type { FormError } from '@frederikhd/quiet';

const draft = ref({ title: '', price: '', compareAt: '' });
const tried = ref(false);

// Every problem, keyed by the id of the field it belongs to.
const errors = computed(() => {
  const e: Record<string, string> = {};
  if (!draft.value.title.trim()) e.title = 'Enter a product title';
  if (!draft.value.price.trim()) e.price = 'Enter a price, like 49,90';
  return e;
});

// Nothing shows until the first submit.
const shown = computed(() => (tried.value ? errors.value : {}));
const summary = computed<FormError[] | null>(() =>
  tried.value && Object.keys(errors.value).length
    ? Object.entries(errors.value).map(([id, message]) => ({ id, message }))
    : null,
);

function save() {
  tried.value = true;
  if (Object.keys(errors.value).length) return;
  // … save, then:
  tried.value = false;
}
```

Each message goes to two places: the Field's `error`, under the field, and the Form's `errors`, in the summary at the top. Write it once and use it in both.

## The error summary

After a submit that leaves errors, the Form shows "Please fix the following" with each error as a link, and moves focus there, so keyboard and screen-reader users hear what's wrong. A link takes focus to its field.

- The summary links to an error through its `id`: the Field's `id` (which becomes the control's id), a FieldGroup's `id`, or a CheckboxGroup's or RadioGroup's `id` (it lands on the first option).
- An error without an `id` is listed as plain text, for problems that belong to no one field.
- Focus moves to the summary when errors first appear and after each submit, not while the list shrinks as people fix things.
- A control in a closed tab opens its tab first, and the tab shows that it has errors.

## Writing messages

Say what's wrong and how to fix it, in the words of the label: "Enter a price, like 49,90", not "Invalid input" or "Price is required". Keep the shop's format in the example (49,90 in Germany).

## Errors from the server

The server has the last word: a SKU that's already taken, a code that has expired. Put its errors into the same two places, and focus moves to the summary when they arrive:

```ts
const serverErrors = ref<Record<string, string>>({});
const shown = computed(() => ({ ...(tried.value ? errors.value : {}), ...serverErrors.value }));

async function save() {
  tried.value = true;
  if (Object.keys(errors.value).length) return;
  const res = await api.saveProduct(draft.value);
  if (res.errors) serverErrors.value = res.errors; // { sku: 'This SKU is already used by Linen shirt' }
}
```

Build `summary` from `shown` the same way. Clear a server error when its field changes.

## Warnings and success

A Field also takes `warning` (allowed but worth a second look: a price below cost) and `success` (a check that passed: "Discount applied"). `error` wins when there are several. Warnings don't stop a save, so leave them out of the summary.

## Checkboxes, radios and groups

- A single checkbox ("I accept the terms") takes `required` and `error` itself, and an `id` for the summary.
- `QCheckboxGroup` and `QRadioGroup` take `label`, `required`, `error` and `id` like a Field, and hold the value with `v-model`.
- A FieldGroup's `error` covers the whole group; its fields' own errors show under each.

## Addresses

`QAddressFields` lays out an address for its country (postcode before or after the city, states where there are states) and `validateAddress` checks it, with messages from the `address` translations:

```ts
const check = computed(() => validateAddress(shipping.value, { idPrefix: 'ship' }));
// check.value.errors → <QAddressFields :errors="tried ? check.errors : {}">
// check.value.list   → the Form's errors, ids already matching
// check.value.valid  → whether to go on
```

## Long forms

- `QFormActions sticky` keeps Cancel and Save at the bottom of the screen. A focused field is scrolled clear of the bar.
- Ask before leaving with unsaved changes, in a `QDialog`.
- After saving, say so with `toast('Product saved', { tone: 'success' })`.

The Product edit and Checkout patterns do all of this.

## Your own controls

A control of your own can sit in a Field like Quiet's. For a native element, bind the Field's `controlAttrs`:

```vue
<QField label="Note" v-slot="{ controlAttrs }">
  <textarea v-bind="controlAttrs" />
</QField>
```

In a component, `useFieldControl()` returns the Field's `id`, `describedBy`, `required`, `disabled`, `readOnly` and `invalid` for you to put on your control.
