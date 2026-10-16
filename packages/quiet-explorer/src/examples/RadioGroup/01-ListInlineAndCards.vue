<script setup lang="ts">
import { QForm, QRadio, QRadioGroup } from 'quiet';
</script>

<template>
  <div class="pv">
    <div class="col">
      <p class="pv-title">List and inline</p>
      <QForm label-placement="top">
        <QRadioGroup label="Product status" default-value="active">
          <QRadio value="active" label="Active" description="Visible in the shop" />
          <QRadio value="draft" label="Draft" description="Only you can see it" />
          <QRadio value="archived" label="Archived" disabled description="Has open orders" />
        </QRadioGroup>
        <QRadioGroup label="Fit" layout="inline" default-value="regular">
          <QRadio value="slim" label="Slim" />
          <QRadio value="regular" label="Regular" />
          <QRadio value="relaxed" label="Relaxed" />
        </QRadioGroup>
        <QRadioGroup label="Return reason" required error="Choose a reason">
          <QRadio value="size" label="Doesn’t fit" />
          <QRadio value="damaged" label="Arrived damaged" />
          <QRadio value="other" label="Something else" />
        </QRadioGroup>
      </QForm>
    </div>
    <div class="col" data-density="compact">
      <p class="pv-title">Compact, cards</p>
      <QForm label-placement="top">
        <QRadioGroup label="Tax" default-value="incl" layout="cards">
          <QRadio value="incl" label="Prices include tax" description="Usual for shops in the EU" />
          <QRadio value="excl" label="Prices exclude tax" description="Tax is added at checkout" />
        </QRadioGroup>
        <QRadioGroup label="Export as" layout="inline" default-value="csv">
          <QRadio value="csv" label="CSV" />
          <QRadio value="xlsx" label="Excel" />
          <QRadio value="pdf" label="PDF" disabled />
        </QRadioGroup>
      </QForm>
    </div>
  </div>
</template>

<style scoped>
.pv { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(300px, 100%), 1fr)); gap: var(--space-8); align-items: start; }
.col { display: grid; gap: var(--field-gap); min-width: 0; }
.pv-title { margin: 0 0 var(--space-1); font: var(--text-caption); color: var(--ink-muted); }
</style>
