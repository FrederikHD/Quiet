<!-- A product edit page: back link, status badge, record actions, and a side column for what people check rather than edit. -->
<script setup lang="ts">
import { QBadge, QButton, QCard, QField, QFieldGroup, QForm, QInput, QPage, QSelect } from '@frederikhd/quiet';
import { reactive } from 'vue';

const v = reactive({
  title: 'Linen shirt, blue',
  price: '59,00',
  compare: '',
  status: 'Active',
  vendor: 'Leinenweberei Rhön',
});
</script>

<template>
  <div class="frame">
    <QPage
      title="Linen shirt, blue"
      :back="{ href: '#products', label: 'Products' }"
      subtitle="SKU LS-2040 · last saved 2 minutes ago"
    >
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
      <template #aside>
        <QCard title="Status">
          <QField label="Status" label-hidden hint="Visible in the online store."
            ><QSelect v-model="v.status" :options="['Active', 'Draft', 'Archived']"
          /></QField>
        </QCard>
        <QCard title="Organisation">
          <QField label="Vendor"><QInput v-model="v.vendor" /></QField>
        </QCard>
      </template>
    </QPage>
  </div>
</template>

<style scoped>
.frame {
  border: 1px solid var(--line);
  border-radius: var(--radius-md);
  background: var(--surface);
}
</style>
