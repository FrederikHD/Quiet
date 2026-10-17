<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, useSlots } from 'vue';
import { useStrings } from '../../config';
import { useQuietId } from '../../composables/useQuietId';
import { useStickyPad } from '../../composables/useStickyPad';
import QButton from '../Button/QButton.vue';
import QDialog from '../Dialog/QDialog.vue';
import QToaster from '../Toast/QToaster.vue';

export interface ShellStrings {
  /** Name of the top bar's menu button. Default "Menu"; also the drawer's title when there is no brand. */
  menu?: string;
  /** The skip link. Default "Skip to content". */
  skip?: string;
  /** Name of the Nav landmark (Nav reads it from the same `shell` namespace). Default "Main". */
  nav?: string;
  /** Name of the drawer's close button. Default "Close menu". */
  closeMenu?: string;
}
export interface AppShellProps {
  /** The shop name (plain type) — or the `brand` slot. */
  brand?: string;
  /** Id of the main element (the skip link's target). Generated when missing. */
  mainId?: string;
  /** AppShell renders a Toaster; false leaves it out. */
  toaster?: boolean;
  /** Phrases for the built-in Toaster: the dismiss button and the region's name. */
  toastStrings?: { dismiss?: string; region?: string };
  /** Built-in phrases (menu button, skip link, close button). */
  strings?: ShellStrings;
}

const props = withDefaults(defineProps<AppShellProps>(), {
  brand: undefined,
  mainId: undefined,
  toaster: true,
  toastStrings: undefined,
  strings: undefined,
});
defineSlots<{
  /** The page — usually a Page. */
  default?(): unknown;
  /** A Nav. Shown in the left column from 1024px, in a drawer below. */
  nav?(): unknown;
  /** The shop name, when it needs more than plain text (a logo). In the side column, the top bar and the drawer. */
  brand?(): unknown;
  /** Under the nav, in the column and the drawer: the account, the store switcher. */
  'nav-footer'?(): unknown;
  /** Phones: icon buttons at the end of the top bar (Search). */
  'top-bar-end'?(): unknown;
}>();

const slots = useSlots();
const strings = useStrings<Required<ShellStrings>>(
  'shell',
  { menu: 'Menu', skip: 'Skip to content', nav: 'Main', closeMenu: 'Close menu' },
  () => props.strings,
);
const autoMainId = useQuietId('q-main-');
const mainId = () => props.mainId ?? autoMainId;
const open = ref(false);
const topbar = ref<HTMLElement | null>(null);
useStickyPad(topbar, 'top'); // 0 high on desktop, where the bar is hidden

// Growing the window to desktop closes the drawer: the navigation is in its column there.
let mq: MediaQueryList | null = null;
const onMedia = () => {
  if (!mq?.matches) open.value = false;
};
onMounted(() => {
  mq = window.matchMedia?.('(max-width: 1023px)') ?? null;
  mq?.addEventListener('change', onMedia);
});
onBeforeUnmount(() => mq?.removeEventListener('change', onMedia));

function skip(e: MouseEvent) {
  const m = document.getElementById(mainId());
  if (!m) return;
  e.preventDefault();
  m.focus();
  m.scrollIntoView({ block: 'start' });
}
// Choosing a page in the drawer closes it.
function onDrawerClick(e: MouseEvent) {
  if ((e.target as Element).closest?.('a[href], [data-nav-close]')) open.value = false;
}
</script>

<template>
  <div class="q-shell">
    <a :href="`#${mainId()}`" class="q-shell__skip" @click="skip">{{ strings.skip }}</a>
    <header ref="topbar" class="q-shell__topbar">
      <QButton variant="ghost" class="q-shell__menu" icon-start="menu" :aria-label="strings.menu" :expanded="open" @click="open = true" />
      <div class="q-shell__brand"><slot name="brand">{{ brand }}</slot></div>
      <div v-if="slots['top-bar-end']" class="q-shell__topend"><slot name="top-bar-end" /></div>
    </header>
    <div class="q-shell__side">
      <div v-if="brand || slots.brand" class="q-shell__brand q-shell__brand--side"><slot name="brand">{{ brand }}</slot></div>
      <div class="q-shell__nav"><slot name="nav" /></div>
      <div v-if="slots['nav-footer']" class="q-shell__navfoot"><slot name="nav-footer" /></div>
    </div>
    <main :id="mainId()" class="q-shell__main" tabindex="-1"><slot /></main>
    <QToaster v-if="toaster" :strings="toastStrings" />
    <QDialog
      v-model:open="open"
      :title="brand || strings.menu"
      placement="start"
      flush
      :close-label="strings.closeMenu"
      class="q-shell__drawerpanel"
    >
      <div class="q-shell__drawer" @click="onDrawerClick">
        <div class="q-shell__nav"><slot name="nav" /></div>
        <div v-if="slots['nav-footer']" class="q-shell__navfoot"><slot name="nav-footer" /></div>
      </div>
    </QDialog>
  </div>
</template>
