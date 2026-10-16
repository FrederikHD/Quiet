<script setup lang="ts">
import { QRadio, QRadioGroup } from 'quiet';
</script>

<template>
  <!-- A Radio always sits in a RadioGroup; here each group is named with aria-label to show the states side by side. -->
  <div class="pv">
    <div class="col">
      <p class="pv-title">States</p>
      <QRadioGroup aria-label="Default states" default-value="on">
        <QRadio value="off" label="Not chosen" />
        <QRadio value="on" label="Chosen" />
      </QRadioGroup>
      <QRadioGroup aria-label="Disabled states" default-value="on" disabled>
        <QRadio value="off" label="Disabled" />
        <QRadio value="on" label="Disabled, chosen" />
      </QRadioGroup>
      <QRadioGroup aria-label="Error state" error="Shown on every option until one is chosen">
        <QRadio value="a" label="Invalid" />
        <QRadio value="b" label="Invalid" />
      </QRadioGroup>
    </div>
    <div class="col">
      <p class="pv-title">Content</p>
      <QRadioGroup aria-label="Content examples" default-value="desc">
        <QRadio value="plain" label="Label only" />
        <QRadio value="desc" label="With a description" description="Delivery time, conditions — one line in ink-muted" />
        <QRadio value="meta" label="With meta" meta="9,90 €" />
      </QRadioGroup>
      <p class="pv-title">As cards</p>
      <QRadioGroup aria-label="Card examples" layout="cards" default-value="exp">
        <QRadio value="std" label="Standard" description="2–4 working days" meta="Free" />
        <QRadio value="exp" label="Express" description="Next working day" meta="9,90 €" />
      </QRadioGroup>
      <div data-density="compact" class="col">
        <p class="pv-title">Compact</p>
        <QRadioGroup aria-label="Compact examples" default-value="a" layout="inline">
          <QRadio value="a" label="CSV" />
          <QRadio value="b" label="Excel" />
        </QRadioGroup>
      </div>
    </div>
  </div>
</template>

<style scoped>
.pv { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(300px, 100%), 1fr)); gap: var(--space-8); align-items: start; }
.col { display: grid; gap: var(--space-4); min-width: 0; align-content: start; }
.pv-title { margin: 0 0 calc(var(--space-2) * -1); font: var(--text-caption); color: var(--ink-muted); }
</style>
