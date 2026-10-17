<!-- Delivery and payment in checkout. Place the order without choosing to see the error summary link to each group. -->
<script setup lang="ts">
import { QButton, QForm, QFormActions, QIcon, QRadio, QRadioGroup, type FormError } from 'quiet';
import { computed, ref } from 'vue';

const ship = ref<string | null>(null);
const pay = ref<string | null>(null);
const tried = ref(false);
const errors = computed<FormError[] | null>(() => {
  if (!tried.value) return null;
  const list: FormError[] = [];
  if (!ship.value) list.push({ id: 'co-ship', message: 'Choose a delivery method' });
  if (!pay.value) list.push({ id: 'co-pay', message: 'Choose how to pay' });
  return list.length ? list : null;
});
const err = (id: string) => errors.value?.find((e) => e.id === id)?.message;
</script>

<template>
  <QForm label-placement="side" :errors="errors" class="checkout" @submit.prevent="tried = true">
    <QRadioGroup id="co-ship" v-model="ship" label="Delivery" layout="cards" required :error="err('co-ship')">
      <QRadio value="std" label="Standard" description="2–4 working days" meta="Free" />
      <QRadio value="exp" label="Express" description="Next working day" meta="9,90 €" />
    </QRadioGroup>
    <QRadioGroup id="co-pay" v-model="pay" label="Payment" layout="cards" required :error="err('co-pay')" help="You are only charged once the parcel ships.">
      <QRadio value="card" label="Card" description="Debit or credit card"><template #media><QIcon name="credit-card" /></template></QRadio>
      <QRadio value="invoice" label="Invoice" description="Pay within 14 days"><template #media><QIcon name="mail" /></template></QRadio>
    </QRadioGroup>
    <QFormActions><QButton variant="primary" type="submit">Place order</QButton></QFormActions>
  </QForm>
</template>

<style scoped>
.checkout { max-width: 720px; }
</style>
