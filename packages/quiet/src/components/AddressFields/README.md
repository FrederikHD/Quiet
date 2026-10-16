# AddressFields

One address, laid out the way its country writes it, with the autocomplete tokens that let the browser fill it in one tap. Checkout delivery and billing addresses; customer addresses in the back office.

```vue
<script setup lang="ts">
import { computed, ref } from 'vue';
import { validateAddress, type Address } from 'quiet';

const ship = ref<Address>({ country: 'DE' });
const tried = ref(false);
const check = computed(() => validateAddress(ship.value, { idPrefix: 'ship' }));
function submit(e: SubmitEvent) {
  e.preventDefault();
  tried.value = true;
  if (check.value.valid) next();
}
</script>

<template>
  <QForm :errors="tried ? check.list : null" @submit="submit">
    <QFormSection title="Delivery address">
      <QAddressFields v-model="ship" id-prefix="ship" :errors="tried ? check.errors : {}" />
    </QFormSection>
  </QForm>
</template>
```

## Behaviour

- **Order:** Country first (it changes the rest), then first and last name side by side, company, street and house number, apartment, then
  - most of Europe: **Postcode · City** in one row (1 : 2);
  - United States: City, then **State · ZIP code**;
  - United Kingdom: Town or city, then Postcode (short field).
  Phone last, with "Only used if the courier needs to reach you".
- **Autocomplete:** `shipping given-name`, `shipping postal-code`, … (`kind="billing"` for billing; `section` for two addresses of the same kind). Postcodes get the numeric keyboard where they are digits only.
- **Required:** everything except company, the second address line and phone. `:fields="{ company: 'hidden', phone: 'required' }"` changes that.
- **Validation** (`validateAddress(value, { idPrefix, fields })`) returns `{ errors, list, valid }`:
  - missing parts: "Enter your city";
  - a postcode in the wrong shape for its country: "Enter a valid postcode, like 10115";
  - no house number where addresses need one (DE, AT, CH, NL, BE, LU, DK, PL): "Add the house number";
  - a phone with letters in it.
  `errors` goes back into the component; `list` goes to the Form's error summary (the ids are `${idPrefix}-${key}`).
- `v-model` holds the whole address; `change` also tells you which part changed: `(nextAddress, changedKey)`.

## Countries

Germany, Austria, Switzerland, the Netherlands, Belgium, Luxembourg, France, Italy, Spain, Denmark, Poland, the UK and the US by default. Pass `countries` to limit or extend the list; a country without a known format gets the European layout and no postcode check.

## Not for

Addresses you only show — write them on one line or in a DescriptionList.

## Keyboard and screen readers

Every part is a labelled field with its autocomplete token, so browsers and password managers fill it. Messages are tied to their fields and listed in the Form's error summary, which jumps to them.

## Built from

Field, FieldGroup, Input and Select.

## What you provide

`v-model`, an `id-prefix` per address, and the `errors` from `validateAddress` once someone has tried to continue.
