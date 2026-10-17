<script setup lang="ts">
// The design system's guidelines are Markdown; this shows them with the explorer's type styles.
import MarkdownIt from 'markdown-it';
import { computed } from 'vue';

const props = defineProps<{ source: string }>();
const md = new MarkdownIt({ html: false, linkify: true, typographer: false });
// Code blocks and wide tables scroll sideways, so keyboard users need to be able to focus them.
const fence = md.renderer.rules.fence!;
md.renderer.rules.fence = (...args) => fence(...args).replace('<pre>', '<pre tabindex="0">');
md.renderer.rules.table_open = () => '<table tabindex="0">\n';
const html = computed(() => md.render(props.source));
</script>

<template>
  <!-- eslint-disable-next-line vue/no-v-html — rendered from the library's own Markdown, with HTML disabled -->
  <div class="ex-prose" v-html="html" />
</template>
