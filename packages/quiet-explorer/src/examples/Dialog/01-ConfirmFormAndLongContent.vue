<script setup lang="ts">
import { QButton, QCombobox, QDialog, QField, QFieldGroup, QForm, QInput, type ComboboxOption } from 'quiet';
import { ref } from 'vue';

const countries = ['Germany', 'Austria', 'Switzerland', 'Belgium', 'Denmark', 'France', 'Italy', 'Netherlands', 'Poland', 'Spain'].map((c) => ({ value: c, label: c }));
const del = ref(false);
const edit = ref(false);
const terms = ref(false);
const log = ref('');
const address = ref({ first: 'Anna', last: 'Schmidt', street: 'Torstraße', no: '115', postcode: '10119', city: 'Berlin' });
const country = ref<ComboboxOption | null>({ value: 'Germany', label: 'Germany' });

function remove() {
  del.value = false;
  log.value = 'Product deleted.';
}
function save() {
  edit.value = false;
  log.value = 'Address saved.';
}
</script>

<template>
  <div class="pv">
    <p class="pv-title">Open each one. Escape, the backdrop or the × closes it; focus stays inside while it is open.</p>
    <div class="row">
      <QButton variant="danger-outline" icon-start="trash" @click="del = true">Delete product</QButton>
      <QButton icon-start="pencil" @click="edit = true">Edit address</QButton>
      <QButton variant="ghost" @click="terms = true">Shipping terms</QButton>
    </div>
    <p class="log" role="status">{{ log }}</p>

    <QDialog
      v-model:open="del"
      role="alertdialog"
      size="sm"
      title="Delete “Linen shirt, blue”?"
      description="It disappears from the shop and from 3 collections. Orders that include it keep it. This can’t be undone."
    >
      <template #footer>
        <QButton @click="del = false">Cancel</QButton>
        <QButton variant="danger" @click="remove">Delete product</QButton>
      </template>
    </QDialog>

    <QDialog v-model:open="edit" title="Edit shipping address">
      <QForm id="addr" label-placement="top" @submit.prevent="save">
        <QFieldGroup>
          <QField label="First name" required><QInput v-model="address.first" autocomplete="given-name" /></QField>
          <QField label="Last name" required><QInput v-model="address.last" autocomplete="family-name" /></QField>
        </QFieldGroup>
        <QFieldGroup :columns="[3, 1]">
          <QField label="Street" required><QInput v-model="address.street" /></QField>
          <QField label="No." required><QInput v-model="address.no" /></QField>
        </QFieldGroup>
        <QFieldGroup :columns="[1, 2]">
          <QField label="Postcode" required><QInput v-model="address.postcode" inputmode="numeric" /></QField>
          <QField label="City" required><QInput v-model="address.city" /></QField>
        </QFieldGroup>
        <QField label="Country" required>
          <QCombobox v-model="country" :options="countries" search-placeholder="Search countries" />
        </QField>
      </QForm>
      <template #footer>
        <QButton @click="edit = false">Cancel</QButton>
        <QButton variant="primary" type="submit" form="addr">Save address</QButton>
      </template>
    </QDialog>

    <QDialog v-model:open="terms" title="Shipping terms" size="lg">
      <div class="terms">
        <p v-for="i in 12" :key="i">
          {{ i }}. Orders placed before 14:00 on a working day leave our warehouse the same day. Delivery within Germany takes 2–4
          working days; to Austria and Switzerland 3–6. Express delivery arrives the next working day. You can return unworn items
          within 30 days.
        </p>
      </div>
      <template #footer><QButton variant="primary" @click="terms = false">Got it</QButton></template>
    </QDialog>
  </div>
</template>

<style scoped>
.pv { display: grid; gap: var(--space-4); }
.pv-title { margin: 0; font: var(--text-caption); color: var(--ink-muted); }
.row { display: flex; flex-wrap: wrap; gap: var(--space-2); }
.log { margin: 0; min-height: 18px; font: var(--text-small); color: var(--ink-muted); }
.terms p { margin: 0 0 var(--space-3); }
</style>
