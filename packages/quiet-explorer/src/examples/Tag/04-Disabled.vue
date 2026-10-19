<!-- disabled: a tag that can't be taken back here, such as a member discount applied automatically. -->
<script setup lang="ts">
import { QTag } from '@frederikhd/quiet';
</script>

<template>
  <div class="row">
    <QTag icon="tag" detail="−5 %" removable disabled>Members</QTag>
    <QTag variant="field" removable disabled>Summer linen</QTag>
  </div>
</template>

<style scoped>
.row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-2);
}
</style>
