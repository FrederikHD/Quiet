<script setup lang="ts">
import { QAppShell, QNav, QSelect, type NavItem, type NavSection } from '@frederikhd/quiet';
import { computed, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { version } from '@quiet/package.json';
import { groups } from './catalog';

const route = useRoute();
const router = useRouter();
// The Toast playground renders its own Toaster to try out; the shell's would show every toast twice.
const toasterPlayground = computed(() => route.params.slug === 'toast' && route.params.tab === 'playground');

const sections = computed<NavSection[]>(() => [
  {
    title: 'Overview',
    items: [
      { label: 'Brand book', href: router.resolve('/').href, icon: 'home', current: route.path === '/' },
      {
        label: 'Tokens',
        href: router.resolve('/foundations/tokens').href,
        icon: 'sliders',
        current: route.name === 'tokens',
      },
      {
        label: 'Icons',
        href: router.resolve('/foundations/icons').href,
        icon: 'grid',
        current: route.name === 'icons',
      },
    ],
  },
  ...groups.map((g) => ({
    title: g.name,
    items: g.entries.map<NavItem>((e) => ({
      label: e.title,
      href: router.resolve(`/components/${e.slug}`).href,
      current: route.params.slug === e.slug,
    })),
  })),
]);

// Links stay real links (open in a new tab works); a plain click routes on the client.
function navigate(item: NavItem, e: MouseEvent) {
  if (!item.href || e.metaKey || e.ctrlKey || e.shiftKey) return;
  e.preventDefault();
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  void router.push(item.href.slice(base.length) || '/');
}

// Theme and density for the whole explorer, remembered in this browser.
const read = (k: string, d: string) => {
  try {
    return localStorage.getItem(k) ?? d;
  } catch {
    return d;
  }
};
const theme = ref(read('quiet-explorer-theme', 'system'));
const density = ref(read('quiet-explorer-density', 'comfortable'));
const dark = window.matchMedia('(prefers-color-scheme: dark)');
function applyTheme() {
  const isDark = theme.value === 'dark' || (theme.value === 'system' && dark.matches);
  document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
}
dark.addEventListener('change', applyTheme);
watch(
  theme,
  (t) => {
    applyTheme();
    try {
      localStorage.setItem('quiet-explorer-theme', t);
    } catch {
      /* private mode: nothing to remember */
    }
  },
  { immediate: true },
);
watch(
  density,
  (d) => {
    document.documentElement.setAttribute('data-density', d);
    try {
      localStorage.setItem('quiet-explorer-density', d);
    } catch {
      /* private mode */
    }
  },
  { immediate: true },
);
</script>

<template>
  <QAppShell brand="Quiet explorer" :toaster="!toasterPlayground">
    <template #nav><QNav :sections="sections" @navigate="navigate" /></template>
    <template #nav-footer>
      <div class="ex-settings">
        <QSelect
          v-model="theme"
          size="slim"
          aria-label="Theme"
          prefix-icon="eye"
          :options="[
            { value: 'system', label: 'System theme' },
            { value: 'light', label: 'Light' },
            { value: 'dark', label: 'Dark' },
          ]"
        />
        <QSelect
          v-model="density"
          size="slim"
          aria-label="Density"
          prefix-icon="list"
          :options="[
            { value: 'comfortable', label: 'Comfortable' },
            { value: 'compact', label: 'Compact' },
          ]"
        />
        <!-- The site is deployed with each release, so it documents the version on npm. -->
        <a class="ex-version" :href="`https://github.com/FrederikHD/Quiet/releases/tag/v${version}`">
          @frederikhd/quiet {{ version }}
        </a>
      </div>
    </template>
    <RouterView :key="String(route.params.slug ?? route.path)" />
  </QAppShell>
</template>
