<!-- Size tiles on the product page. A sold-out size can still be chosen, and the button offers "Notify me" instead. -->
<script setup lang="ts">
import { QButton, QForm, QFormActions, QRadio, QRadioGroup } from 'quiet';
import { computed, ref } from 'vue';

const soldOut = ['XS', 'XL'];
const size = ref<string | null>(null);
const tried = ref(false);
const notify = computed(() => !!size.value && soldOut.includes(size.value));
</script>

<template>
  <QForm label-placement="top" @submit.prevent="tried = true">
    <QRadioGroup
      v-model="size"
      label="Size"
      layout="buttons"
      required
      :error="tried && !size ? 'Choose a size' : null"
      :hint="notify ? `Sold out in ${size}. We can email you when it’s back.` : undefined"
    >
      <QRadio v-for="s in ['XS', 'S', 'M', 'L', 'XL']" :key="s" :value="s" :label="s" :sold-out="soldOut.includes(s)" />
    </QRadioGroup>
    <QFormActions align="start">
      <QButton variant="primary" size="large" type="submit">{{ notify ? 'Notify me' : 'Add to cart' }}</QButton>
    </QFormActions>
  </QForm>
</template>
