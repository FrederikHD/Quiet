<script setup lang="ts">
import { computed, ref, useAttrs } from 'vue';
import QButton from '../Button/QButton.vue';
import type { ItemKey } from '../../types';
import QIcon from '../Icon/QIcon.vue';
import type { IconName } from '../Icon/icons';
import QPopover from '../Popover/QPopover.vue';

export interface MenuItem {
  /** What the item does: "Edit", "Delete". */
  label?: string;
  /** An icon before the label. */
  icon?: IconName;
  /** A second, muted line: "Hidden, kept in reports". */
  description?: string;
  /** Called when chosen (the menu also emits `select`). */
  onSelect?: (event: MouseEvent) => void;
  /** Makes the item a link (navigation instead of an action). */
  href?: string;
  /** Destructive action: danger text. Put it last, after a divider. */
  danger?: boolean;
  /** Shown dimmed, skipped by the arrow keys, can't be chosen. Say why in `description`. */
  disabled?: boolean;
  /** A rule between groups (other fields ignored). */
  divider?: boolean;
  /** Stable key for the list (default: the index). */
  key?: ItemKey;
}
export interface MenuProps {
  /** Names the menu and the default ⋯ button: "Actions for #10530". */
  label: string;
  /** The actions, in order. null and false entries are skipped, so an item can be left out with `cond && {…}`. */
  items: (MenuItem | null | false)[];
  /** Which edge of the trigger the menu lines up with. Default end. */
  align?: 'start' | 'end';
  /** Variant of the default ⋯ trigger. Default ghost. */
  variant?: 'secondary' | 'ghost';
  /** Size of the default ⋯ trigger, as Button's size. Default `default` (follows the density). */
  size?: 'slim' | 'default' | 'large';
}

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<MenuProps>(), { align: 'end', variant: 'ghost', size: 'default' });
const emit = defineEmits<{ /** An item was chosen. */ select: [item: MenuItem, event: MouseEvent] }>();
defineSlots<{
  /** Your own trigger (a Button), instead of the ⋯ icon button. */
  trigger?(): unknown;
  /** Your own content for an item's label line (the icon and the row stay): `#item="{ item }"`. */
  item?(props: { item: MenuItem }): unknown;
}>();

const attrs = useAttrs();
const open = ref(false);
const list = ref<HTMLElement | null>(null);
const items = computed(() => props.items.filter((x): x is MenuItem => !!x));

// ↑ ↓ Home End and typing a letter move between items; Enter / Space choose (native buttons; links take Space here).
function onKeyDown(e: KeyboardEvent) {
  const t = e.target as HTMLElement | null;
  if (e.key === ' ' && t?.tagName === 'A' && t.getAttribute('role') === 'menuitem') {
    e.preventDefault();
    t.click();
    return;
  }
  const nodes = Array.from(
    list.value?.querySelectorAll<HTMLElement>('[role="menuitem"]:not([aria-disabled="true"])') ?? [],
  );
  const i = nodes.indexOf(document.activeElement as HTMLElement);
  let next: HTMLElement | undefined;
  if (e.key === 'ArrowDown') next = nodes[(i + 1) % nodes.length];
  else if (e.key === 'ArrowUp') next = nodes[(i - 1 + nodes.length) % nodes.length];
  else if (e.key === 'Home') next = nodes[0];
  else if (e.key === 'End') next = nodes[nodes.length - 1];
  else if (e.key.length === 1 && /\S/.test(e.key) && !e.ctrlKey && !e.metaKey && !e.altKey) {
    const ch = e.key.toLowerCase();
    for (let k = 1; k <= nodes.length; k++) {
      const c = nodes[(i + k) % nodes.length];
      if ((c.textContent ?? '').trim().toLowerCase().startsWith(ch)) {
        next = c;
        break;
      }
    }
  }
  if (next) {
    e.preventDefault();
    next.focus();
  }
}

// Choosing closes the menu; focus goes back to the button unless the action moved it (opened a dialog, navigated).
function choose(it: MenuItem, e: MouseEvent) {
  if (it.disabled) {
    e.preventDefault();
    return;
  }
  open.value = false;
  it.onSelect?.(e);
  emit('select', it, e);
}
</script>

<template>
  <QPopover v-model:open="open" kind="menu" :label="label" :align="align" flush panel-class="q-menu__popover">
    <slot name="trigger">
      <QButton
        v-bind="attrs"
        :variant="variant"
        :size="size"
        class="q-menu__more"
        icon-start="more"
        :aria-label="label"
      />
    </slot>
    <template #content>
      <!-- eslint-disable-next-line vuejs-accessibility/interactive-supports-focus -- focus moves between the menuitems (roving focus), not onto the menu itself -->
      <ul ref="list" role="menu" :aria-label="label" class="q-menu" @keydown="onKeyDown">
        <template v-for="(it, i) in items" :key="it.key ?? i">
          <li v-if="it.divider" role="separator" class="q-menu__divider" />
          <li v-else role="none">
            <component
              :is="it.href ? 'a' : 'button'"
              role="menuitem"
              tabindex="-1"
              :class="['q-menu__item', it.danger && 'q-menu__item--danger']"
              :href="it.href && !it.disabled ? it.href : undefined"
              :type="it.href ? undefined : 'button'"
              :aria-disabled="it.disabled ? 'true' : undefined"
              @click="choose(it, $event)"
            >
              <span v-if="it.icon" class="q-menu__icon" aria-hidden="true"><QIcon :name="it.icon" /></span>
              <span class="q-menu__text">
                <span class="q-menu__label"
                  ><slot name="item" :item="it">{{ it.label }}</slot></span
                >
                <span v-if="it.description" class="q-menu__desc">{{ it.description }}</span>
              </span>
            </component>
          </li>
        </template>
      </ul>
    </template>
  </QPopover>
</template>
