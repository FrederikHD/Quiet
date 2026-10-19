<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useStrings } from '../../config';
import { useQuietId } from '../../composables/useQuietId';
import QLead from '../../internal/QLead.vue';
import { provideNoField } from '../Field/context';
import type { IconName } from '../Icon/icons';
import QInput from '../Input/QInput.vue';
import QIcon from '../Icon/QIcon.vue';
import QSearchOption from './QSearchOption.vue';

export interface SearchSuggestion {
  /** Stable id for the list (default: the label). */
  id?: string;
  /** What the row says: the product's or the page's name. */
  label: string;
  /** A second, muted line: the category, the colour. */
  description?: string;
  /** A product picture (URL). */
  image?: string;
  /** An icon instead of a picture (pages, categories). */
  icon?: IconName;
  /** Right side: a price. */
  meta?: string;
  [key: string]: unknown;
}
export interface SearchSuggestionGroup {
  /** Heads the group: "Products", "Pages". */
  label?: string;
  /** The group's suggestions. */
  items: SearchSuggestion[];
}
export interface SearchBoxStrings {
  /** The field's (hidden) label and the list's name. Default "Search". */
  label?: string;
  /** The placeholder. Default "Search". */
  placeholder?: string;
  /** Not used at present: SearchBox has no submit button (Enter searches). Default "Search". */
  submit?: string;
  /** Name of the clear (×) button. Default "Clear search". */
  clear?: string;
  /** The last option: "Search for “linen”". */
  searchFor?: (q: string) => string;
  /** Announced as the suggestions change: "3 suggestions". */
  count?: (n: number) => string;
}
export interface SearchBoxProps {
  /** A flat list, or groups: [{ label: 'Products', items: [...] }]. */
  suggestions?: SearchSuggestion[] | SearchSuggestionGroup[];
  /** The "Search for “…”" option at the end of the list. Default true; false leaves it out. */
  searchOption?: boolean;
  /** The list in the flow instead of floating (inside a phone dialog). */
  inline?: boolean;
  /** default follows the density (40px comfortable, 32px compact); large (48px) for the storefront header and phones. */
  size?: 'default' | 'large';
  /** The field's name for screen readers (visually hidden). Default "Search"; say what is searched: "Search products". */
  label?: string;
  /** The placeholder. Default "Search" (strings.placeholder). */
  placeholder?: string;
  /** Focus the field when it mounts (a search dialog that just opened). */
  autofocus?: boolean;
  /** Translations: label, placeholder, clear, searchFor, count (and the unused submit); or once with configure({ strings: { search } }). */
  strings?: SearchBoxStrings;
}

const props = withDefaults(defineProps<SearchBoxProps>(), {
  suggestions: () => [],
  searchOption: true,
  size: 'default',
  label: undefined,
  placeholder: undefined,
  strings: undefined,
});
/** The text in the field. */
const model = defineModel<string>({ default: '' });
const emit = defineEmits<{
  /** Enter, or the "Search for “…”" option. */
  submit: [query: string];
  /** A suggestion was chosen; your item comes back as it was passed. */
  select: [item: SearchSuggestion];
}>();

provideNoField();
const strings = useStrings<Required<SearchBoxStrings>>(
  'search',
  {
    label: 'Search',
    placeholder: 'Search',
    submit: 'Search',
    clear: 'Clear search',
    searchFor: (q) => `Search for “${q}”`,
    count: (n) => (n === 0 ? 'No suggestions' : n === 1 ? '1 suggestion' : `${n} suggestions`),
  },
  () => props.strings,
);
const id = useQuietId('q-search-');
const root = ref<HTMLFormElement | null>(null);
const list = ref<HTMLElement | null>(null);
const input = ref<InstanceType<typeof QInput> | null>(null);
const open = ref(false);
const active = ref(-1);

type Option = (SearchSuggestion & { __submit?: false }) | { __submit: true; label: string };
const groups = computed<SearchSuggestionGroup[]>(() => {
  const s = (props.suggestions ?? []).filter(Boolean);
  return s.length && !('items' in s[0]) ? [{ items: s as SearchSuggestion[] }] : (s as SearchSuggestionGroup[]);
});
const flat = computed(() => groups.value.flatMap((g) => g.items ?? []));
const q = computed(() => model.value.trim());
// The last option is always "Search for “…”".
const submitOption = computed<Option | null>(() => (q.value && props.searchOption ? { __submit: true, label: strings.value.searchFor(q.value) } : null));
const options = computed<Option[]>(() => (submitOption.value ? [...flat.value, submitOption.value] : flat.value));
const show = computed(() => open.value && !!q.value && options.value.length > 0);
// Index of each suggestion across groups.
const indexOf = (g: number, i: number) => groups.value.slice(0, g).reduce((a, x) => a + (x.items?.length ?? 0), 0) + i;

function set(v: string) {
  model.value = v;
  active.value = -1;
  open.value = true;
}
function choose(opt: Option | null) {
  open.value = false;
  active.value = -1;
  if (!opt || opt.__submit) emit('submit', q.value);
  else emit('select', opt);
}
// ↓ ↑ move through suggestions, Enter opens the highlighted one (or searches), Esc closes, Esc again clears.
function onKeyDown(e: KeyboardEvent) {
  if (e.key === 'ArrowDown') {
    e.preventDefault();
    if (!show.value) open.value = true;
    else active.value = active.value + 1 >= options.value.length ? 0 : active.value + 1;
  } else if (e.key === 'ArrowUp') {
    e.preventDefault();
    if (show.value) active.value = active.value <= 0 ? options.value.length - 1 : active.value - 1;
  } else if (e.key === 'Escape') {
    if (show.value) {
      e.preventDefault();
      e.stopPropagation();
      open.value = false;
      active.value = -1;
    } else if (model.value) {
      e.preventDefault();
      e.stopPropagation();
      set('');
      open.value = false;
    }
  } else if (e.key === 'Enter') {
    e.preventDefault();
    if (show.value && active.value >= 0) choose(options.value[active.value]);
    else if (q.value) choose(null);
  } else if (e.key === 'Tab') open.value = false;
}

// Close when focus or a click leaves the box.
function away(e: Event) {
  if (root.value && !root.value.contains(e.target as Node)) {
    open.value = false;
    active.value = -1;
  }
}
watch(open, (o) => {
  if (o) {
    document.addEventListener('mousedown', away);
    document.addEventListener('focusin', away);
  } else {
    document.removeEventListener('mousedown', away);
    document.removeEventListener('focusin', away);
  }
});
onBeforeUnmount(() => {
  document.removeEventListener('mousedown', away);
  document.removeEventListener('focusin', away);
});
watch(active, async (i) => {
  if (i < 0) return;
  await nextTick();
  list.value?.querySelector<HTMLElement>(`[data-i="${i}"]`)?.scrollIntoView?.({ block: 'nearest' });
});
onMounted(() => {
  if (props.autofocus) input.value?.focus();
});
</script>

<template>
  <form
    ref="root"
    role="search"
    :class="['q-search', size === 'large' && 'q-search--large']"
    @submit.prevent="q && choose(null)"
  >
    <label class="q-visually-hidden" :for="id">{{ label ?? strings.label }}</label>
    <QInput
      :id="id"
      ref="input"
      type="search"
      class="q-search__box"
      :size="size === 'large' ? 'large' : undefined"
      :model-value="model"
      :placeholder="placeholder ?? strings.placeholder"
      enterkeyhint="search"
      autocomplete="off"
      autocorrect="off"
      autocapitalize="off"
      :spellcheck="false"
      role="combobox"
      :aria-expanded="show ? 'true' : 'false'"
      :aria-controls="show ? `${id}-list` : undefined"
      aria-autocomplete="list"
      :aria-activedescendant="show && active >= 0 ? `${id}-opt-${active}` : undefined"
      clearable
      :clear-label="strings.clear"
      @update:model-value="set(String($event ?? ''))"
      @clear="open = false"
      @keydown="onKeyDown"
      @focus="open = true"
    >
      <template #prefix><QIcon name="search" /></template>
    </QInput>
    <div v-if="show" :class="['q-search__panel', inline && 'q-search__panel--inline']">
      <ul :id="`${id}-list`" ref="list" role="listbox" :aria-label="label ?? strings.label" class="q-search__list">
        <template v-for="(g, gi) in groups" :key="gi">
          <li v-if="g.label && g.items?.length" role="presentation" class="q-search__group">
            <div :id="`${id}-g${gi}`" class="q-search__grouplabel" aria-hidden="true">{{ g.label }}</div>
            <ul role="group" :aria-labelledby="`${id}-g${gi}`" class="q-search__sub">
              <QSearchOption
                v-for="(opt, oi) in g.items"
                :id="`${id}-opt-${indexOf(gi, oi)}`"
                :key="`${opt.id ?? opt.label}-${oi}`"
                :index="indexOf(gi, oi)"
                :option="opt"
                :active="active === indexOf(gi, oi)"
                @choose="choose(opt)"
                @hover="active = indexOf(gi, oi)"
              />
            </ul>
          </li>
          <template v-else-if="!g.label">
            <QSearchOption
              v-for="(opt, oi) in g.items"
              :id="`${id}-opt-${indexOf(gi, oi)}`"
              :key="`${opt.id ?? opt.label}-${oi}`"
              :index="indexOf(gi, oi)"
              :option="opt"
              :active="active === indexOf(gi, oi)"
              @choose="choose(opt)"
              @hover="active = indexOf(gi, oi)"
            />
          </template>
        </template>
        <li
          v-if="submitOption"
          :id="`${id}-opt-${flat.length}`"
          :data-i="flat.length"
          role="option"
          :aria-selected="active === flat.length"
          :class="['q-search__opt', 'q-search__opt--submit', active === flat.length && 'is-active']"
          @mousedown.prevent
          @click="choose(submitOption)"
          @mousemove="active !== flat.length && (active = flat.length)"
        >
          <QLead icon="search" />
          <span class="q-search__text"><span class="q-search__label">{{ submitOption.label }}</span></span>
        </li>
      </ul>
    </div>
    <span class="q-visually-hidden" aria-live="polite">{{ show ? strings.count(flat.length) : '' }}</span>
  </form>
</template>
