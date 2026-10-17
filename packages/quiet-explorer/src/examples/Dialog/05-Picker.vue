<!-- mobile="inset" keeps a small picker as a floating card on phones instead of a bottom sheet. -->
<script setup lang="ts">
import { QButton, QDialog, QRadio, QRadioGroup } from 'quiet';
import { ref } from 'vue';

const open = ref(false);
const size = ref('M');
const draft = ref(size.value);

function show() {
  draft.value = size.value;
  open.value = true;
}
function choose() {
  size.value = draft.value;
  open.value = false;
}
</script>

<template>
  <div>
    <QButton icon-end="chevron-down" @click="show">Size: {{ size }}</QButton>
    <QDialog v-model:open="open" title="Choose a size" size="sm" mobile="inset">
      <QRadioGroup v-model="draft" label="Size" label-hidden>
        <QRadio v-for="s in ['S', 'M', 'L']" :key="s" :value="s" :label="s" />
        <QRadio value="XL" label="XL, sold out" disabled />
      </QRadioGroup>
      <template #footer>
        <QButton @click="open = false">Cancel</QButton>
        <QButton variant="primary" @click="choose">Choose size</QButton>
      </template>
    </QDialog>
  </div>
</template>
