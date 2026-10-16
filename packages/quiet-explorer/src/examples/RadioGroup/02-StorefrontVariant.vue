<script setup lang="ts">
import { QButton, QForm, QFormActions, QRadio, QRadioGroup } from 'quiet';
import { computed, ref } from 'vue';
import { swatchOf } from '../../fixtures/pictures';

// Swatches and size buttons; Rust, XS and XL are sold out but still choosable. Add to cart without a size.
const colour = ref('Navy');
const size = ref<string | null>(null);
const tried = ref(false);
const soldOut: Record<string, boolean> = { XS: true, XL: true };
const notify = computed(() => !!size.value && soldOut[size.value]);
</script>

<template>
  <QForm label-placement="top" class="pv" @submit.prevent="tried = true">
    <QRadioGroup v-model="colour" label="Colour" layout="swatches">
      <QRadio v-for="n in ['Navy', 'Sand', 'Olive', 'Rust', 'Natural']" :key="n" :value="n" :label="n" :swatch="swatchOf(n)" :sold-out="n === 'Rust'" />
    </QRadioGroup>
    <QRadioGroup
      v-model="size"
      label="Size"
      layout="buttons"
      required
      :error="tried && !size ? 'Choose a size' : null"
      :hint="notify ? `Sold out in ${size} — we can email you when it’s back.` : undefined"
    >
      <QRadio v-for="n in ['XS', 'S', 'M', 'L', 'XL']" :key="n" :value="n" :label="n" :sold-out="!!soldOut[n]" />
    </QRadioGroup>
    <QFormActions align="start">
      <QButton variant="primary" size="large" type="submit">{{ notify ? 'Notify me' : 'Add to cart' }}</QButton>
    </QFormActions>
  </QForm>
</template>

<style scoped>
.pv { max-width: 720px; }
</style>
