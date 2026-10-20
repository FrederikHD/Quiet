<script setup lang="ts">
// Switches between the two published explorers: the released version at the site's root, and develop (what the next
// release will contain) under next/. Both links open the same page in the other one. Shown only in those builds.
import { version } from '@quiet/package.json';
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const channel = import.meta.env.VITE_EXPLORER_CHANNEL;
const route = useRoute();
const base = import.meta.env.BASE_URL;
const root = channel === 'next' ? base.replace(/next\/$/, '') : base;
const href = (to: 'release' | 'next') =>
  computed(() => `${root}${to === 'next' ? 'next/' : ''}${route.fullPath.slice(1)}`);
const options = [
  { channel: 'release', label: version, title: `Released version ${version}, as on npm`, href: href('release') },
  { channel: 'next', label: 'develop', title: 'Develop: what the next release will contain', href: href('next') },
] as const;
</script>

<template>
  <span v-if="channel" class="ex-switch" role="group" aria-label="Documentation version">
    <a
      v-for="o in options"
      :key="o.channel"
      :href="o.href.value"
      :title="o.title"
      :aria-current="o.channel === channel ? 'page' : undefined"
      class="ex-switch__option"
      >{{ o.label }}</a
    >
  </span>
</template>

<style scoped>
.ex-switch {
  display: inline-flex;
  margin-inline-start: var(--space-2);
  border: 1px solid var(--line-strong);
  border-radius: var(--radius-full);
  vertical-align: middle;
  overflow: hidden;
}
/* The side column is too narrow for the name and the switch on one line: there it goes underneath. */
.q-shell__brand--side .ex-switch {
  display: flex;
  width: fit-content;
  margin: var(--space-2) 0 0;
}
.ex-switch__option {
  padding: 2px var(--space-2);
  color: var(--ink-muted);
  font: var(--text-caption);
  text-decoration: none;
}
.ex-switch__option:hover {
  color: var(--ink);
}
.ex-switch__option:focus-visible {
  outline: 2px solid var(--brand);
  outline-offset: -2px;
  border-radius: var(--radius-full);
}
.ex-switch__option[aria-current='page'] {
  background: var(--brand-tint);
  color: var(--brand);
  font-weight: 600;
}
</style>
