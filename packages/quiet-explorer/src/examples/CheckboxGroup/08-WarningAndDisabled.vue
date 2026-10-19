<!-- A warning only informs and leaves the boxes as they are; a disabled group says why in its hint. -->
<script setup lang="ts">
import { QCheckbox, QCheckboxGroup, QForm } from '@frederikhd/quiet';
</script>

<template>
  <QForm label-placement="top">
    <QCheckboxGroup label="Discount applies to" warning="Sale items are already reduced by 30 %" :default-value="['full', 'sale']">
      <QCheckbox value="full" label="Full-price items" />
      <QCheckbox value="sale" label="Sale items" />
    </QCheckboxGroup>
    <QCheckboxGroup label="Channels" disabled hint="Set by your plan." :default-value="['web']">
      <QCheckbox value="web" label="Online store" />
      <QCheckbox value="pos" label="Point of sale" />
    </QCheckboxGroup>
  </QForm>
</template>
