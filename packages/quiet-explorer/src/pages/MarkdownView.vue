<script setup lang="ts">
// The design system's guidelines are Markdown; this shows them with the explorer's type styles.
import MarkdownIt from 'markdown-it';
import { computed } from 'vue';

const props = defineProps<{ source: string }>();
const md = new MarkdownIt({ html: false, linkify: true, typographer: false });
const html = computed(() => md.render(props.source));
</script>

<template>
  <!-- eslint-disable-next-line vue/no-v-html — rendered from the library's own Markdown, with HTML disabled -->
  <div class="ex-prose" v-html="html" />
</template>
