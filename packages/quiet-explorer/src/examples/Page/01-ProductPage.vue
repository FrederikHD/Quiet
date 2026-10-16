<script setup lang="ts">
import { QBadge, QButton, QCard, QField, QFieldGroup, QForm, QInput, QPage, QSelect } from 'quiet';
import { reactive } from 'vue';

const v = reactive({ status: 'Active', vendor: 'Leinenweberei Rhön', type: 'Shirts', title: 'Linen shirt, blue', price: '59,00', compare: '', berlin: '24', hamburg: '6' });
</script>

<template>
  <div class="frame">
    <QPage title="Linen shirt, blue" :back="{ href: '#products', label: 'Products' }" subtitle="SKU LS-2040 · last saved 2 minutes ago">
      <template #title-meta><QBadge tone="success">Active</QBadge></template>
      <template #actions>
        <QButton icon-start="copy">Duplicate</QButton>
        <QButton icon-start="external-link">Preview</QButton>
      </template>
      <QCard title="Details">
        <QForm label-placement="top">
          <QField label="Title" required><QInput v-model="v.title" /></QField>
          <QFieldGroup :columns="[1, 1]">
            <QField label="Price"><QInput v-model="v.price" suffix="€" align="end" numeric /></QField>
            <QField label="Compare-at price"><QInput v-model="v.compare" suffix="€" align="end" numeric /></QField>
          </QFieldGroup>
        </QForm>
      </QCard>
      <QCard title="Inventory" description="Stock at each location">
        <template #actions><QButton size="slim" variant="ghost">Adjust</QButton></template>
        <QForm label-placement="side">
          <QField label="Berlin" width="s"><QInput v-model="v.berlin" numeric align="end" suffix="pcs" /></QField>
          <QField label="Hamburg" width="s"><QInput v-model="v.hamburg" numeric align="end" suffix="pcs" /></QField>
        </QForm>
      </QCard>
      <template #aside>
        <QCard title="Status">
          <QForm label-placement="top">
            <QField label="Status" label-hidden><QSelect v-model="v.status" :options="['Active', 'Draft', 'Archived']" /></QField>
            <p class="note">Visible in the online store and point of sale.</p>
          </QForm>
        </QCard>
        <QCard title="Organisation">
          <QForm label-placement="top">
            <QField label="Vendor"><QInput v-model="v.vendor" /></QField>
            <QField label="Product type"><QInput v-model="v.type" /></QField>
          </QForm>
        </QCard>
      </template>
    </QPage>
  </div>
</template>

<style scoped>
.frame { border: 1px solid var(--line); border-radius: var(--radius-md); background: var(--surface); }
.note { margin: 0; font: var(--text-small); color: var(--ink-muted); }
</style>
