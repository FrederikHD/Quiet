<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, useModel, useSlots } from 'vue';
import { useStrings } from '../../config';
import { useQuietId } from '../../composables/useQuietId';
import { useResizeObserver } from '../../composables/useResizeObserver';
import { useStickyPad } from '../../composables/useStickyPad';
import QButton from '../Button/QButton.vue';
import QDialog from '../Dialog/QDialog.vue';
import QIcon from '../Icon/QIcon.vue';
import QToaster from '../Toast/QToaster.vue';

export interface ShellStrings {
  /** Name of the top bar's menu button. Default "Menu"; also the drawer's title when there is no brand. */
  menu?: string;
  /** The skip link. Default "Skip to content". */
  skip?: string;
  /** Name of the drawer's close button. Default "Close menu". */
  closeMenu?: string;
  /** Name of the edge button while the column is open (`collapsible`). Default "Hide navigation". */
  collapse?: string;
  /** Name of the edge button while the column is closed (`collapsible`). Default "Show navigation". */
  expand?: string;
}
export interface AppShellProps {
  /** The shop name in plain type (or use the `brand` slot). Also titles the drawer. */
  brand?: string;
  /** Id of the main element (the skip link's target). Generated when missing. */
  mainId?: string;
  /** AppShell renders a Toaster, so toast() works on every page; false leaves it out. Default true. */
  toaster?: boolean;
  /** Built-in phrases: the menu button, the skip link and the drawer's close button. */
  strings?: ShellStrings;
  /** Fill a box instead of the window: the shell scrolls inside its parent (give that a height) and the drawer opens
   *  over the shell, not the page. For previews and shells embedded in another page. */
  contained?: boolean;
  /** From 1024px, a round button at the bottom of the column's edge hides the navigation and shows it again, so the page gets the
   *  full width. Bind `v-model:collapsed` to remember the choice. Below 1024px the menu button and drawer are unchanged. */
  collapsible?: boolean;
  /** Whether the column is hidden (`collapsible`). Default false. */
  collapsed?: boolean;
}

const props = withDefaults(defineProps<AppShellProps>(), {
  brand: undefined,
  mainId: undefined,
  toaster: true,
  strings: undefined,
  contained: false,
  collapsible: false,
  collapsed: false,
});
defineEmits<{ 'update:collapsed': [value: boolean] }>();
defineSlots<{
  /** The page — usually a Page. */
  default?(): unknown;
  /** A Nav. Shown in the left column from 1024px, in a drawer below. */
  nav?(): unknown;
  /** The shop name, when it needs more than plain text (a logo). In the side column, the top bar and the drawer. */
  brand?(): unknown;
  /** Under the nav, in the column and the drawer: the account, the store switcher. */
  'nav-footer'?(): unknown;
  /** Below 1024px: one or two icon buttons at the end of the top bar (Search). */
  'top-bar-end'?(): unknown;
}>();

const slots = useSlots();
const strings = useStrings<Required<ShellStrings>>(
  'shell',
  {
    menu: 'Menu',
    skip: 'Skip to content',
    closeMenu: 'Close menu',
    collapse: 'Hide navigation',
    expand: 'Show navigation',
  },
  () => props.strings,
);
const autoMainId = useQuietId('q-main-');
const mainId = () => props.mainId ?? autoMainId;
const open = ref(false);
const collapsedModel = useModel(props, 'collapsed');
// Only a collapsible shell hides its column: `collapsed` alone does nothing, so there is always a way back.
const isCollapsed = computed(() => props.collapsible && collapsedModel.value);
const sideId = useQuietId('q-side-');
// With a nav footer, the edge button sits on the line above it, clear of the footer's controls: that line's height.
const foot = ref<HTMLElement | null>(null);
const footHeight = ref(0);
useResizeObserver(foot, () => (footHeight.value = foot.value?.offsetHeight ?? 0));
const topbar = ref<HTMLElement | null>(null);
if (!props.contained) useStickyPad(topbar, 'top'); // 0 high on desktop, where the bar is hidden

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
// Choosing a page in the drawer closes it: a link, a Nav item (also one without href, for a router), or anything marked data-nav-close.
function onDrawerClick(e: MouseEvent) {
  if ((e.target as Element).closest?.('a[href], .q-nav__link, [data-nav-close]')) open.value = false;
}
</script>

<template>
  <div
    :class="[
      'q-shell',
      contained && 'q-shell--contained',
      collapsible && 'q-shell--collapsible',
      isCollapsed && 'is-collapsed',
    ]"
  >
    <a :href="`#${mainId()}`" class="q-shell__skip" @click="skip">{{ strings.skip }}</a>
    <header ref="topbar" class="q-shell__topbar">
      <QButton
        variant="ghost"
        class="q-shell__menu"
        icon-start="menu"
        :aria-label="strings.menu"
        :expanded="open"
        @click="open = true"
      />
      <div class="q-shell__brand">
        <slot name="brand">{{ brand }}</slot>
      </div>
      <div v-if="slots['top-bar-end']" class="q-shell__topend"><slot name="top-bar-end" /></div>
    </header>
    <div class="q-shell__side">
      <!-- Clips the column while it slides; inert while hidden, so its links leave the Tab order. -->
      <div :id="sideId" class="q-shell__sideclip" :inert="isCollapsed || undefined">
        <div class="q-shell__sidein">
          <div v-if="brand || slots.brand" class="q-shell__brand q-shell__brand--side">
            <slot name="brand">{{ brand }}</slot>
          </div>
          <div class="q-shell__nav"><slot name="nav" /></div>
          <div v-if="slots['nav-footer']" ref="foot" class="q-shell__navfoot"><slot name="nav-footer" /></div>
        </div>
      </div>
      <button
        v-if="collapsible"
        type="button"
        class="q-shell__collapse"
        :style="footHeight ? { bottom: `${footHeight - 12}px` } : undefined"
        :aria-label="isCollapsed ? strings.expand : strings.collapse"
        :aria-expanded="!isCollapsed"
        :aria-controls="sideId"
        @click="collapsedModel = !isCollapsed"
      >
        <QIcon :name="isCollapsed ? 'chevron-right' : 'chevron-left'" size="sm" />
      </button>
    </div>
    <main :id="mainId()" class="q-shell__main" tabindex="-1"><slot /></main>
    <QToaster v-if="toaster" />
    <QDialog
      v-model:open="open"
      :title="brand || strings.menu"
      placement="start"
      flush
      :strings="{ close: strings.closeMenu }"
      class="q-shell__drawerpanel"
      :teleport="contained ? false : 'body'"
    >
      <!-- eslint-disable-next-line vuejs-accessibility/click-events-have-key-events, vuejs-accessibility/no-static-element-interactions -- click delegation: closes the drawer after a link or button inside it was chosen; those handle the keyboard themselves -->
      <div class="q-shell__drawer" @click="onDrawerClick">
        <div class="q-shell__nav"><slot name="nav" /></div>
        <div v-if="slots['nav-footer']" class="q-shell__navfoot"><slot name="nav-footer" /></div>
      </div>
    </QDialog>
  </div>
</template>
