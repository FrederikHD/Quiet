<!-- A short form in a dialog. The submit button sits in the footer and points at the form with form="…"; an empty required field keeps the dialog open with its error. -->
<script setup lang="ts">
import {
  QButton,
  QCombobox,
  QDialog,
  QField,
  QFieldGroup,
  QForm,
  QInput,
  type ComboboxOption,
} from '@frederikhd/quiet';
import { nextTick, ref } from 'vue';

const countries = [
  'Germany',
  'Austria',
  'Switzerland',
  'Belgium',
  'Denmark',
  'France',
  'Italy',
  'Netherlands',
  'Poland',
  'Spain',
].map((c) => ({ value: c, label: c }));
const open = ref(false);
const log = ref('');
const address = ref({
  first: 'Anna',
  last: 'Schmidt',
  street: 'Torstraße',
  no: '115',
  postcode: '10119',
  city: 'Berlin',
});
const country = ref<ComboboxOption | null>(countries[0]);

const tried = ref(false);
const missing = (value: string, message: string) => (tried.value && !value.trim() ? message : undefined);

async function save() {
  tried.value = true;
  const a = address.value;
  if (![a.first, a.last, a.street, a.no, a.postcode, a.city].every((v) => v.trim()) || !country.value) {
    // The dialog stays open; focus goes to the first field to fix.
    await nextTick();
    document.querySelector<HTMLElement>('#edit-address [aria-invalid="true"]')?.focus();
    return;
  }
  tried.value = false;
  open.value = false;
  log.value = 'Address saved.';
}
</script>

<template>
  <div class="demo">
    <QButton icon-start="pencil" @click="open = true">Edit address</QButton>
    <p class="log" role="status">{{ log }}</p>

    <QDialog v-model:open="open" title="Edit shipping address">
      <QForm id="edit-address" label-placement="top" @submit.prevent="save">
        <QFieldGroup>
          <QField label="First name" required :error="missing(address.first, 'Enter a first name')"
            ><QInput v-model="address.first" autocomplete="given-name"
          /></QField>
          <QField label="Last name" required :error="missing(address.last, 'Enter a last name')"
            ><QInput v-model="address.last" autocomplete="family-name"
          /></QField>
        </QFieldGroup>
        <QFieldGroup :columns="[3, 1]">
          <QField label="Street" required :error="missing(address.street, 'Enter a street')"
            ><QInput v-model="address.street"
          /></QField>
          <QField label="No." required :error="missing(address.no, 'Enter a house number')"
            ><QInput v-model="address.no"
          /></QField>
        </QFieldGroup>
        <QFieldGroup :columns="[1, 2]">
          <QField label="Postcode" required :error="missing(address.postcode, 'Enter a postcode')"
            ><QInput v-model="address.postcode" inputmode="numeric"
          /></QField>
          <QField label="City" required :error="missing(address.city, 'Enter a city')"
            ><QInput v-model="address.city"
          /></QField>
        </QFieldGroup>
        <QField label="Country" required :error="tried && !country ? 'Choose a country' : undefined">
          <QCombobox v-model="country" :options="countries" search-placeholder="Search countries" />
        </QField>
      </QForm>
      <template #footer>
        <QButton @click="open = false">Cancel</QButton>
        <QButton variant="primary" type="submit" form="edit-address">Save address</QButton>
      </template>
    </QDialog>
  </div>
</template>

<style scoped>
.demo {
  display: grid;
  justify-items: start;
  gap: var(--space-3);
}
.log {
  margin: 0;
  min-height: 20px;
  font: var(--text-small);
  color: var(--ink-muted);
}
</style>
