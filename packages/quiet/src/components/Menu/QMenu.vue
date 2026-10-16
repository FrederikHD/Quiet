<script setup lang="ts">
import { computed, ref, useAttrs } from 'vue';
import QButton from '../Button/QButton.vue';
import QIcon from '../Icon/QIcon.vue';
import type { IconName } from '../Icon/icons';
import QPopover from '../Popover/QPopover.vue';

export interface MenuItem {
  label?: string;
  icon?: IconName;
  description?: string;
  /** Called when chosen (the menu also emits `select`). */
  onSelect?: (event: MouseEvent) => void;
  href?: string;
  danger?: boolean;
  disabled?: boolean;
  /** A rule between groups (other fields ignored). */
  divider?: boolean;
  key?: string;
}
export interface MenuProps {
  /** Names the menu and the default ⋯ button: "Actions for #10530". */
  label: string;
  items: (MenuItem | null | false)[];
  /** Default end. */
  align?: 'start' | 'end';
  /** For the default ⋯ trigger. */
  variant?: 'secondary' | 'ghost';
  size?: 'slim' | 'default' | 'large';
}

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<MenuProps>(), { align: 'end', variant: 'ghost', size: 'default' });
const emit = defineEmits<{ /** An item was chosen. */ select: [item: MenuItem, event: MouseEvent] }>();
defineSlots<{ /** Your own trigger (a Button). */ trigger?(): unknown }>();

const attrs = useAttrs();
const open = ref(false);
const list = ref<HTMLElement | null>(null);
const items = computed(() => props.items.filter((x): x is MenuItem => !!x));

// ↑ ↓ Home End and typing a letter move between items; Enter / Space choose (native buttons and links).
function onKeyDown(e: KeyboardEvent) {
  const nodes = Array.from(list.value?.querySelectorAll<HTMLElement>('[role="menuitem"]:not([aria-disabled="true"])') ?? []);
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
      <QButton v-bind="attrs" :variant="variant" :size="size" class="q-menu__more" icon-start="more" :aria-label="label" />
    </slot>
    <template #content>
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
                <span class="q-menu__label">{{ it.label }}</span>
                <span v-if="it.description" class="q-menu__desc">{{ it.description }}</span>
              </span>
            </component>
          </li>
        </template>
      </ul>
    </template>
  </QPopover>
</template>
