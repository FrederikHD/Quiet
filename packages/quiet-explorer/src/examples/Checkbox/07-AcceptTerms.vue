<!-- A required checkbox in a CheckboxGroup, which shows the error. Press Place order without ticking it. -->
<script setup lang="ts">
import { QButton, QCheckbox, QCheckboxGroup, QForm, QFormActions } from 'quiet';
import { ref } from 'vue';

const terms = ref(false);
const tried = ref(false);
</script>

<template>
  <QForm label-placement="top" @submit.prevent="tried = true">
    <QCheckboxGroup required :error="tried && !terms ? 'Accept the terms to place your order' : null">
      <QCheckbox v-model="terms" value="yes" name="terms" label="I accept the terms and the cancellation policy" />
    </QCheckboxGroup>
    <QFormActions align="start"><QButton variant="primary" type="submit">Place order</QButton></QFormActions>
  </QForm>
</template>
