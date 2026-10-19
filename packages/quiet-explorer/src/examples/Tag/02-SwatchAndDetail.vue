<!-- A colour dot for a colour filter; an icon and a detail for an applied discount code. -->
<script setup lang="ts">
import { QTag } from '@frederikhd/quiet';
import { swatchOf } from '../../fixtures/pictures';
</script>

<template>
  <div class="row">
    <QTag :swatch="swatchOf('Navy')">Navy</QTag>
    <QTag :swatch="swatchOf('Sand')">Sand</QTag>
    <QTag icon="tag" detail="−10 %">LINEN10</QTag>
  </div>
</template>

<style scoped>
.row { display: flex; flex-wrap: wrap; align-items: center; gap: var(--space-2); }
</style>
