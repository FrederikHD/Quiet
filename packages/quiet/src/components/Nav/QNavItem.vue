<script setup lang="ts">
// One link in the Nav; a parent opens to show its sub-pages while it or one of them is current.
import { computed } from 'vue';
import QIcon from '../Icon/QIcon.vue';
import type { NavItem } from './types';

const props = defineProps<{ item: NavItem; depth: number }>();
const emit = defineEmits<{ navigate: [item: NavItem, event: MouseEvent] }>();

const within = (it: NavItem): boolean => !!it.current || (it.items ?? []).some(within);
const kids = computed(() => (props.item.items?.length ? props.item.items : null));
const expanded = computed(() => !!kids.value && (props.item.expanded ?? within(props.item)));
</script>

<template>
  <li class="q-nav__item">
    <component
      :is="item.href != null ? 'a' : 'button'"
      :class="['q-nav__link', depth > 0 && 'q-nav__link--sub', item.current && 'is-current', !item.current && kids && within(item) && 'is-within']"
      :href="item.href"
      :type="item.href != null ? undefined : 'button'"
      :aria-current="item.current ? 'page' : undefined"
      @click="emit('navigate', item, $event)"
    >
      <span v-if="depth === 0 && item.icon" class="q-nav__icon" aria-hidden="true"><QIcon :name="item.icon" /></span>
      <span class="q-nav__label">{{ item.label }}</span>
      <template v-if="item.badge != null">
        <span class="q-nav__badge" :aria-hidden="item.badgeLabel ? 'true' : undefined">{{ item.badge }}</span>
        <span v-if="item.badgeLabel" class="q-visually-hidden">, {{ item.badgeLabel }}</span>
      </template>
    </component>
    <ul v-if="expanded" class="q-nav__list q-nav__list--sub">
      <QNavItem v-for="(c, j) in kids!" :key="c.key ?? c.href ?? j" :item="c" :depth="depth + 1" @navigate="(i, e) => emit('navigate', i, e)" />
    </ul>
  </li>
</template>
