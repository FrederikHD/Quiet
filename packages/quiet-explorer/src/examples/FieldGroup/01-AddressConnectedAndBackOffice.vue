<script setup lang="ts">
import { QField, QFieldGroup, QForm, QInput, QSelect } from 'quiet';
import { ref } from 'vue';

const v = ref({
  first: 'Anna', last: 'Schmidt', street: 'Torstraße', no: '', postcode: '10115', city: 'Berlin',
  dial: '+49', phone: '30 901820', prefix: 'ORD-', next: '01020', amount: '25,00', period: 'month',
  starts: '20.10.2026', ends: '12.10.2026', length: '30', width: '22', height: '4',
});
const dialCodes = [
  { label: 'Most common', options: [{ value: '+49', label: 'DE +49' }, { value: '+43', label: 'AT +43' }, { value: '+41', label: 'CH +41' }] },
  {
    label: 'Other countries',
    options: [
      { value: '+32', label: 'BE +32' }, { value: '+45', label: 'DK +45' }, { value: '+33', label: 'FR +33' }, { value: '+39', label: 'IT +39' },
      { value: '+31', label: 'NL +31' }, { value: '+48', label: 'PL +48' }, { value: '+34', label: 'ES +34' }, { value: '+44', label: 'GB +44' },
      { value: '+1', label: 'US +1' },
    ],
  },
];
</script>

<template>
  <div class="pv">
    <div>
      <p class="pv-title">Checkout address — labels on top, no group label, [1, 2] and [3, 1]</p>
      <QForm label-placement="top" markers="optional">
        <QFieldGroup>
          <QField label="First name" required><QInput v-model="v.first" autocomplete="given-name" /></QField>
          <QField label="Last name" required><QInput v-model="v.last" autocomplete="family-name" /></QField>
        </QFieldGroup>
        <QFieldGroup :columns="[3, 1]">
          <QField label="Street" required><QInput v-model="v.street" autocomplete="address-line1" /></QField>
          <QField label="House number" required error="Enter a house number"><QInput v-model="v.no" autocomplete="address-line2" /></QField>
        </QFieldGroup>
        <QFieldGroup :columns="[1, 2]">
          <QField label="Postcode" required><QInput v-model="v.postcode" autocomplete="postal-code" inputmode="numeric" /></QField>
          <QField label="City" required><QInput v-model="v.city" autocomplete="address-level2" /></QField>
        </QFieldGroup>
      </QForm>
    </div>
    <div>
      <p class="pv-title">connected — Select + Input, Input + Input, Input + Select</p>
      <QForm label-placement="top">
        <QFieldGroup label="Phone" :columns="[1, 3]" connected required hint="For delivery questions only.">
          <QField label="Country code" label-hidden><QSelect v-model="v.dial" autocomplete="tel-country-code" :options="dialCodes" /></QField>
          <QField label="Phone number" label-hidden><QInput v-model="v.phone" autocomplete="tel-national" inputmode="tel" /></QField>
        </QFieldGroup>
        <QFieldGroup :columns="[1, 3]" connected>
          <QField label="Prefix"><QInput v-model="v.prefix" /></QField>
          <QField label="Next number" error="Must be higher than the last order, 01049"><QInput v-model="v.next" numeric align="end" /></QField>
        </QFieldGroup>
        <QFieldGroup label="Subscription price" :columns="[2, 1]" connected hint="Charged at the start of each period.">
          <QField label="Amount" label-hidden><QInput v-model="v.amount" suffix="€" numeric align="end" inputmode="decimal" /></QField>
          <QField label="Billing period" label-hidden>
            <QSelect v-model="v.period" :options="[{ value: 'month', label: 'per month' }, { value: 'year', label: 'per year' }]" />
          </QField>
        </QFieldGroup>
      </QForm>
    </div>
    <div>
      <p class="pv-title">Back office — group label beside, group error</p>
      <QForm label-placement="side" density="compact">
        <QFieldGroup
          label="Sale period"
          required
          error="The end date must be after the start date"
          help="The sale price applies from the start of the first day to the end of the last."
        >
          <QField label="Starts"><QInput v-model="v.starts" /></QField>
          <QField label="Ends"><QInput v-model="v.ends" invalid /></QField>
        </QFieldGroup>
        <QFieldGroup label="Dimensions" hint="Packed size, used for shipping rates." :columns="[1, 1, 1]" stack="late">
          <QField label="Length"><QInput v-model="v.length" suffix="cm" numeric align="end" /></QField>
          <QField label="Width"><QInput v-model="v.width" suffix="cm" numeric align="end" /></QField>
          <QField label="Height"><QInput v-model="v.height" suffix="cm" numeric align="end" /></QField>
        </QFieldGroup>
      </QForm>
    </div>
  </div>
</template>

<style scoped>
.pv { display: grid; gap: var(--space-6); max-width: 720px; }
.pv-title { margin: 0 0 var(--space-2); font: var(--text-caption); color: var(--ink-muted); }
</style>
