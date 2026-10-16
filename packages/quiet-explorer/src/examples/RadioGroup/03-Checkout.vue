<script setup lang="ts">
import { QButton, QCheckbox, QCheckboxGroup, QField, QForm, QFormActions, QIcon, QInput, QRadio, QRadioGroup, QSelect, type FormError } from 'quiet';
import { ref } from 'vue';

// Labels beside from 400px. Submit it empty to see the error summary and the messages.
const email = ref('');
const country = ref('Germany');
const ship = ref<string | null>(null);
const pay = ref<string | null>(null);
const news = ref<string[]>([]);
const terms = ref(false);
const errors = ref<FormError[] | null>(null);

function check() {
  const list: FormError[] = [];
  if (!/.+@.+\..+/.test(email.value)) list.push({ id: 'co-email', message: 'Enter your email address' });
  if (!ship.value) list.push({ id: 'co-ship', message: 'Choose a delivery method' });
  if (!pay.value) list.push({ id: 'co-pay', message: 'Choose how to pay' });
  if (!terms.value) list.push({ id: 'co-terms', message: 'Accept the terms to place your order' });
  errors.value = list.length ? list : null;
}
const err = (id: string) => errors.value?.find((x) => x.id === id)?.message ?? null;
</script>

<template>
  <QForm label-placement="side" markers="optional" :errors="errors" class="pv" @submit.prevent="check">
    <QField id="co-email" label="Email" required :error="err('co-email')"><QInput v-model="email" type="email" autocomplete="email" /></QField>
    <QField label="Country" required>
      <QSelect v-model="country" :options="['Germany', 'Austria', 'Switzerland', 'Netherlands']" autocomplete="country-name" />
    </QField>
    <QRadioGroup id="co-ship" v-model="ship" label="Delivery" required layout="cards" :error="err('co-ship')">
      <QRadio value="std" label="Standard" description="2–4 working days" meta="Free" />
      <QRadio value="exp" label="Express" description="Next working day" meta="9,90 €" />
      <QRadio value="pick" label="Pick up in store" description="Berlin, Torstraße 115 · ready in 2 hours" meta="Free" />
    </QRadioGroup>
    <QRadioGroup id="co-pay" v-model="pay" label="Payment" required layout="cards" :error="err('co-pay')" help="You are only charged once the parcel ships.">
      <QRadio value="card" label="Card" description="Debit or credit card"><template #media><QIcon name="credit-card" /></template></QRadio>
      <QRadio value="invoice" label="Invoice" description="Pay within 14 days"><template #media><QIcon name="mail" /></template></QRadio>
      <QRadio value="transfer" label="Bank transfer" description="We ship when the money arrives"><template #media><QIcon name="clock" /></template></QRadio>
    </QRadioGroup>
    <QCheckboxGroup v-model="news" label="Updates">
      <QCheckbox value="news" label="Send me the newsletter" description="About once a month. Unsubscribe any time." />
    </QCheckboxGroup>
    <QCheckboxGroup id="co-terms" required :error="err('co-terms')">
      <QCheckbox v-model="terms" value="yes" label="I accept the terms and the cancellation policy" />
    </QCheckboxGroup>
    <QFormActions><QButton variant="primary" type="submit">Place order</QButton></QFormActions>
  </QForm>
</template>

<style scoped>
.pv { max-width: 720px; }
</style>
