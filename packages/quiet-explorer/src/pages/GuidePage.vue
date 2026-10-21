<script setup lang="ts">
import { QPage } from '@frederikhd/quiet';
import { computed, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { guides } from '../guides';
import MarkdownView from './MarkdownView.vue';

const props = defineProps<{ slug: string }>();
const router = useRouter();
const guide = computed(() => guides.find((g) => g.slug === props.slug)!);

// The page's h1 is the guide's title, so the Markdown's own "# Title" (there for GitHub) is dropped.
// Links between guides are written as "forms.md" so they work on GitHub; here they are pages.
const source = ref('');
watch(
  guide,
  async (g) => {
    const md = await g.load();
    if (g === guide.value) source.value = md.replace(/^# .*\n+/, '').replace(/\]\(([a-z-]+)\.md\)/g, ']($1)');
  },
  { immediate: true },
);

// Links to other pages of this site route in the app; new-tab clicks and other sites keep the browser's behaviour.
function follow(e: MouseEvent) {
  const a = (e.target as Element).closest('a');
  if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
  const url = new URL(a.href);
  const base = new URL(router.resolve('/').href, location.href).pathname;
  if (url.origin !== location.origin || !url.pathname.startsWith(base)) return;
  e.preventDefault();
  void router.push('/' + url.pathname.slice(base.length) + url.hash);
}
</script>

<template>
  <QPage :title="guide.title">
    <!-- Clicks on the links inside are delegated to follow(); the links themselves are keyboard-operable. -->
    <MarkdownView :source="source" @click="follow" />
  </QPage>
</template>
