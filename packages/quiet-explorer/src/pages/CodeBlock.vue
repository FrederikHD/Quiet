<script setup lang="ts">
import { QButton, toast } from 'quiet';

const props = defineProps<{ code: string; lang?: string }>();

async function copy() {
  try {
    await navigator.clipboard.writeText(props.code);
    toast('Copied to the clipboard', { tone: 'success' });
  } catch {
    toast('Couldn’t copy — select the code and copy it yourself.', { tone: 'error' });
  }
}
</script>

<template>
  <div class="ex-code">
    <QButton class="ex-code__copy" size="slim" variant="ghost" icon-start="copy" aria-label="Copy code" @click="copy" />
    <pre tabindex="0"><code :data-lang="lang">{{ code }}</code></pre>
  </div>
</template>
