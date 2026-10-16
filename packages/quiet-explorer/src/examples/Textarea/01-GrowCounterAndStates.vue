<script setup lang="ts">
import { QField, QForm, QTextarea } from 'quiet';
import { reactive } from 'vue';

const v = reactive({
  description: 'Breathable linen from the Rhön, washed for a soft hand. Relaxed fit with a straight hem — wear it tucked or loose.',
  gift: '',
  reason: '',
  note: 'Gift — please leave out the invoice.',
  internal: 'Pack in tissue paper.',
});
</script>

<template>
  <div class="pv">
    <QForm label-placement="top">
      <p class="pv-title">Grows with the text (up to 10 lines), 500 characters</p>
      <QField label="Description" hint="Shown on the product page under the price.">
        <QTextarea v-model="v.description" auto-grow :max-rows="10" :rows="3" :maxlength="500" />
      </QField>
      <QField label="Gift message" hint="Printed on the card. Type to see the counter turn when 10 or fewer are left.">
        <QTextarea v-model="v.gift" :rows="2" :maxlength="60" placeholder="Happy birthday, Lea!" />
      </QField>
    </QForm>
    <QForm label-placement="top">
      <p class="pv-title">States</p>
      <QField label="Reason for the refund" required error="Tell the customer why — at least a few words"><QTextarea v-model="v.reason" :rows="3" /></QField>
      <QField label="Order note" readonly><QTextarea v-model="v.note" :rows="2" /></QField>
      <div data-density="compact">
        <QField label="Internal note (compact)" disabled hint="Locked while the order ships."><QTextarea v-model="v.internal" :rows="2" /></QField>
      </div>
    </QForm>
  </div>
</template>

<style scoped>
.pv { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(300px, 100%), 1fr)); gap: var(--space-8); align-items: start; }
.pv-title { margin: 0 0 var(--space-2); font: var(--text-caption); color: var(--ink-muted); }
</style>
