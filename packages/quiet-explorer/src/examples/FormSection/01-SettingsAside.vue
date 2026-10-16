<script setup lang="ts">
import { QField, QFieldGroup, QForm, QFormSection, QInput } from 'quiet';
import { ref } from 'vue';

const v = ref({ name: 'Leinen & Co.', email: 'hallo@leinen.example', prefix: 'ORD-', next: '01050' });
</script>

<template>
  <div class="pv">
    <QForm label-placement="top" density="compact">
      <QFormSection title="Store details" description="Shown in the shop footer and on invoices." layout="aside">
        <QField label="Store name" required><QInput v-model="v.name" /></QField>
        <QField label="Support email" required hint="Customers reply to this address."><QInput v-model="v.email" type="email" /></QField>
      </QFormSection>
      <QFormSection title="Order numbers" description="How new order numbers start." layout="aside">
        <QFieldGroup :columns="[1, 3]" connected :hint="`The next order will be ${v.prefix}${v.next}.`">
          <QField label="Prefix"><QInput v-model="v.prefix" /></QField>
          <QField label="Next number"><QInput v-model="v.next" numeric align="end" /></QField>
        </QFieldGroup>
      </QFormSection>
    </QForm>
  </div>
</template>

<style scoped>
.pv { max-width: 900px; }
</style>
