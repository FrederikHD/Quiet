# AddressFields

One address, laid out the way its country writes it, with the autocomplete tokens that let the browser fill it in one tap. Checkout delivery and billing addresses; customer addresses in the back office.

```vue
<script setup lang="ts">
import { computed, ref } from 'vue';
import { validateAddress, type Address } from '@frederikhd/quiet';

const ship = ref<Address>({ country: 'DE' });
const tried = ref(false);
const check = computed(() => validateAddress(ship.value, { idPrefix: 'ship' }));
function submit(e: SubmitEvent) {
  e.preventDefault();
  tried.value = true;
  if (check.value.valid) {
    // continue to the next step
  }
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
    Phone last, with the hint "Only used if the courier needs to reach you" (`phoneHint` changes it; `null` removes it).
- **Autocomplete:** `shipping given-name`, `shipping postal-code`, … (`kind="billing"` for billing; `section` for two addresses of the same kind). `kind="none"` leaves the prefix out. Postcodes get the numeric keyboard where they are digits only, and the phone field the phone keyboard.
- **Required:** everything except company, the second address line and phone. `:fields="{ company: 'hidden', phone: 'required' }"` changes that.
- **Validation** (`validateAddress(value, { idPrefix, fields })`) returns `{ errors, list, valid }`:
  - missing parts: "Enter your city";
  - a postcode in the wrong shape for its country: "Enter a valid postcode, like 10115";
  - no house number where addresses need one (DE, AT, CH, NL, BE, LU, DK, PL): "Add the house number";
  - a phone that isn't at least 6 digits, spaces, `+`, `(`, `)`, `/` or `-`: "Enter a phone number with digits only, + and spaces".
    Pass it the same `fields` as the component, and `strings` if you translate the messages. `errors` goes back into the component; `list` goes to the Form's error summary (the ids are `${idPrefix}-${key}`).
- `v-model` holds the whole address; `@change` also tells you which part changed: `(nextAddress, changedKey)`.

## Countries

Germany, Austria, Switzerland, the Netherlands, Belgium, Luxembourg, France, Italy, Spain, Denmark, Poland, the UK and the US by default. Pass `countries` to limit or extend the list; a country without a known format gets the European layout and no postcode or house-number check. The country is always required; `countryPlaceholder` ("Choose a country") shows in the select until one is chosen.

## Not for

Addresses you only show — write them on one line or in a DescriptionList.

## Keyboard and screen readers

Every part is an ordinary labelled field (Input, or Select for the country) with its autocomplete token, so browsers and password managers fill it. Required parts carry `aria-required`. Each message is tied to its field and read with it; the Form's error summary lists them and jumps to the field by its id (`${idPrefix}-${key}`). Changing the country can change the labels and parts that follow (ZIP code, State); the country select keeps focus.

## Built from

Field, FieldGroup, Input and Select.

## What you provide

- **Optional:** `idPrefix` (default "address"; one per address on the page), `errors` (from `validateAddress`, once someone has tried to continue; default none), `kind` (`shipping` | `billing` | `none`, default `shipping`), `section` (for two addresses of the same kind), `fields` (`{ company, line2, phone }`, each `optional` | `required` | `hidden`; all optional by default), `countries` (default the 13 above), `countryPlaceholder`, `phoneHint` (default "Only used if the courier needs to reach you"; `null` for none), `disabled` (disables every part).
- **v-model:** `v-model` (the whole `Address`: `country`, `firstName`, `lastName`, `company`, `line1`, `line2`, `postalCode`, `city`, `state`, `phone`).
- **Events:** `@change(nextAddress, changedKey)` after every edit.
- **Translations:** `strings`, or once with `configure({ strings: { address: … } })` — labels `country` ("Country"), `firstName` ("First name"), `lastName` ("Last name"), `company` ("Company"), `line1` ("Street and house number"), `line2` ("Apartment, floor, etc."), `postalCode` ("Postcode"), `zip` ("ZIP code"), `city` ("City"), `town` ("Town or city"), `state` ("State"), `phone` ("Phone"), `phoneHint`; messages `missing(label)` ("Enter your city"), `chooseCountry` ("Choose a country"), `badPostal(label, example)` ("Enter a valid postcode, like 10115"), `noNumber` ("Add the house number"), `badPhone` ("Enter a phone number with digits only, + and spaces").
