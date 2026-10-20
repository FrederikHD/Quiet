<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, useAttrs, watch } from 'vue';
import { useStrings } from '../../config';
import { useQuietId } from '../../composables/useQuietId';
import QLead from '../../internal/QLead.vue';
import type { ItemKey } from '../../types';
import { joinIds } from '../../utils/dom';
import QButton from '../Button/QButton.vue';
import { useControlId, useFieldControl } from '../Field/context';
import QIcon from '../Icon/QIcon.vue';
import QMenu, { type MenuItem } from '../Menu/QMenu.vue';
import { fileMatches as matches, formatSize } from './files';

export interface FileUploadItem {
  key: ItemKey;
  name: string;
  /** Bytes. */
  size?: number;
  /** A file you already have, or the preview of a new image. */
  url?: string | null;
  /** A file just added; upload it yourself. */
  file?: File;
}
export interface FileUploadStrings {
  choose?: string;
  chooseOne?: string;
  chooseImages?: string;
  drop?: string;
  dropOne?: string;
  remove?: (name: string) => string;
  main?: string;
  tooBig?: (name: string, max: string) => string;
  wrongType?: (name: string, accept: string) => string;
  tooMany?: (max: number) => string;
  acceptImages?: string;
  move?: (name: string) => string;
  position?: (position: number, total: number) => string;
  makeMain?: string;
  moveStart?: string;
  moveEarlier?: string;
  moveLater?: string;
  moveEnd?: string;
  moved?: (name: string, position: number, total: number) => string;
  movedMain?: (name: string) => string;
}
export interface FileUploadProps {
  /** images: thumbnail grid, the first is the main image. Default: a file list. */
  variant?: 'files' | 'images';
  /** Several files (default true for images). false: one file; a new one replaces it. */
  multiple?: boolean;
  /** e.g. '.pdf,application/pdf' or 'image/*'. Images default to JPG, PNG, WebP, GIF. */
  accept?: string;
  /** The accepted type in words, for the rejection message: "a PDF". */
  acceptLabel?: string;
  /** Bytes. */
  maxSize?: number;
  /** Most files in the list; the choose button is disabled once it's full. */
  maxFiles?: number;
  /** A handle on each item to change the order: drag it, use the arrow keys, or pick a move from its menu. Default true for images (the first is the main image), false for files. */
  reorderable?: boolean;
  /** Also follows the surrounding Field's disabled. */
  disabled?: boolean;
  /** Also follows the surrounding Field's error. */
  invalid?: boolean;
  /** Name of the native file input. It is emptied after each pick, so a plain form post carries no files: upload `file` from the value yourself. */
  name?: string;
  /** Goes on the choose button. Inside a Field the Field's id wins (this one is handed to it), so its label names the button. */
  id?: string;
  /** Overrides the button, hint and rejection texts, e.g. for another language. */
  strings?: FileUploadStrings;
}

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<FileUploadProps>(), {
  variant: 'files',
  multiple: undefined,
  accept: undefined,
  acceptLabel: undefined,
  maxSize: undefined,
  maxFiles: undefined,
  reorderable: undefined,
  name: undefined,
  id: undefined,
  strings: undefined,
});
/** Files you already have (url) and new ones (file + an object URL for the preview). */
const model = defineModel<FileUploadItem[]>({ default: () => [] });

const attrs = useAttrs();
const field = useFieldControl();
const strings = useStrings<Required<FileUploadStrings>>(
  'upload',
  {
    choose: 'Choose files',
    chooseOne: 'Choose a file',
    chooseImages: 'Add images',
    drop: 'or drop them here',
    dropOne: 'or drop it here',
    remove: (name) => `Remove ${name}`,
    main: 'Main image',
    tooBig: (name, max) => `“${name}” is larger than ${max}.`,
    wrongType: (name, accept) => `“${name}” isn’t ${accept}.`,
    tooMany: (max) => `Only ${max} ${max === 1 ? 'file' : 'files'} can be added.`,
    acceptImages: 'an image (JPG, PNG, WebP or GIF)',
    move: (name) => `Move ${name}`,
    position: (position, total) => `Position ${position} of ${total}. The arrow keys move it.`,
    makeMain: 'Make main image',
    moveStart: 'Move to the start',
    moveEarlier: 'Move earlier',
    moveLater: 'Move later',
    moveEnd: 'Move to the end',
    moved: (name, position, total) => `${name} moved to position ${position} of ${total}.`,
    movedMain: (name) => `${name} is now the main image.`,
  },
  () => props.strings,
);

const images = computed(() => props.variant === 'images');
const multiple = computed(() => props.multiple ?? images.value);
const accept = computed(() => props.accept ?? (images.value ? 'image/jpeg,image/png,image/webp,image/gif' : undefined));
const isDisabled = computed(() => props.disabled || !!field?.value.disabled);
const isInvalid = computed(() => props.invalid || String(attrs['aria-invalid']) === 'true' || !!field?.value.invalid);
const controlId = useControlId(field, () => props.id);
const over = ref(false);
const rejects = ref<string[]>([]);
const input = ref<HTMLInputElement | null>(null);
const button = ref<InstanceType<typeof QButton> | null>(null);
const root = ref<HTMLElement | null>(null);
const msgId = useQuietId('q-upload-msg-');
const textId = useQuietId('q-upload-text-');
let seq = 0;

// Object URLs made here are released when their item goes away.
const made = new Map<string, string>();
watch(model, (list) => {
  const keep = new Set(list.map((i) => i.key));
  for (const [k, url] of made) {
    if (keep.has(k)) continue;
    URL.revokeObjectURL(url);
    made.delete(k);
  }
});
onBeforeUnmount(() => made.clear()); // items still in the value keep their preview: the app may show them again

function add(files: FileList | null | undefined) {
  if (isDisabled.value) return;
  const errs: string[] = [];
  const added: FileUploadItem[] = [];
  const room = props.maxFiles ? props.maxFiles - (multiple.value ? model.value.length : 0) : Infinity;
  for (const f of Array.from(files ?? [])) {
    if (!matches(f, accept.value)) {
      errs.push(
        strings.value.wrongType(
          f.name,
          images.value && !props.accept ? strings.value.acceptImages : (props.acceptLabel ?? accept.value ?? ''),
        ),
      );
      continue;
    }
    if (props.maxSize && f.size > props.maxSize) {
      errs.push(strings.value.tooBig(f.name, formatSize(props.maxSize)));
      continue;
    }
    if (added.length >= room) {
      const msg = strings.value.tooMany(props.maxFiles!);
      if (!errs.includes(msg)) errs.push(msg);
      continue;
    }
    const key = `f${Date.now().toString(36)}${++seq}`;
    const url = /^image\//.test(f.type) && typeof URL.createObjectURL === 'function' ? URL.createObjectURL(f) : null;
    if (url) made.set(key, url);
    added.push({ key, name: f.name, size: f.size, url, file: f });
  }
  rejects.value = errs;
  if (added.length) model.value = multiple.value ? [...model.value, ...added] : added.slice(0, 1);
  if (input.value) input.value.value = '';
}

// Keep focus in the component after removing: on the next remove button, or the choose button.
async function remove(it: FileUploadItem, i: number) {
  model.value = model.value.filter((x) => x.key !== it.key);
  await nextTick();
  const btns = root.value?.querySelectorAll<HTMLElement>('.q-upload__remove') ?? [];
  (btns[Math.min(i, btns.length - 1)] ?? root.value?.querySelector<HTMLElement>('.q-upload__zone .q-btn'))?.focus();
}

const chooseLabel = computed(() =>
  images.value ? strings.value.chooseImages : multiple.value ? strings.value.choose : strings.value.chooseOne,
);
// Reordering: a handle on each item that can be dragged (mouse, touch, pen), moved with the arrow keys, or clicked
// for a menu of moves — the single-pointer way WCAG 2.5.7 asks for. Each move is announced.
const canReorder = computed(() => (props.reorderable ?? images.value) && !isDisabled.value && model.value.length > 1);
const announced = ref('');
async function move(from: number, to: number, refocus = true) {
  const list = [...model.value];
  to = Math.max(0, Math.min(list.length - 1, to));
  if (from === to || !list[from]) return;
  const [it] = list.splice(from, 1);
  list.splice(to, 0, it);
  model.value = list;
  announce(it, to);
  if (!refocus) return;
  await nextTick();
  root.value?.querySelectorAll<HTMLElement>('.q-upload__move')[to]?.focus();
}
async function announce(it: FileUploadItem, to: number) {
  announced.value = '';
  await nextTick();
  announced.value =
    images.value && to === 0
      ? strings.value.movedMain(it.name)
      : strings.value.moved(it.name, to + 1, model.value.length);
}
function moveItems(i: number): (MenuItem | false)[] {
  const last = model.value.length - 1;
  return [
    i > 0 && {
      label: images.value ? strings.value.makeMain : strings.value.moveStart,
      icon: 'chevrons-left',
      onSelect: () => move(i, 0),
    },
    i > 0 && { label: strings.value.moveEarlier, icon: 'chevron-left', onSelect: () => move(i, i - 1) },
    i < last && { label: strings.value.moveLater, icon: 'chevron-right', onSelect: () => move(i, i + 1) },
    i < last && { label: strings.value.moveEnd, icon: 'chevrons-right', onSelect: () => move(i, last) },
  ];
}
function onMoveKey(e: KeyboardEvent, i: number) {
  const rtl = !!root.value && getComputedStyle(root.value).direction === 'rtl';
  const back = rtl ? 'ArrowRight' : 'ArrowLeft';
  const fwd = rtl ? 'ArrowLeft' : 'ArrowRight';
  const to =
    e.key === back || e.key === 'ArrowUp'
      ? i - 1
      : e.key === fwd || e.key === 'ArrowDown'
        ? i + 1
        : e.key === 'Home'
          ? 0
          : e.key === 'End'
            ? model.value.length - 1
            : null;
  if (to == null) return;
  e.preventDefault();
  move(i, to);
}

// Dragging follows the pointer on the window: the item's DOM node moves while it is dragged, which would end a
// pointer capture on the handle. The order changes live; Escape puts it back.
const dragging = ref<ItemKey | null>(null);
let drag: { key: ItemKey; x: number; y: number; start: FileUploadItem[]; moved: boolean } | null = null;
let swallowClick = false;
function onMoveDown(e: PointerEvent, it: FileUploadItem) {
  if (e.button !== 0 || !e.isPrimary) return;
  drag = { key: it.key, x: e.clientX, y: e.clientY, start: model.value, moved: false };
  window.addEventListener('pointermove', onDragMove);
  window.addEventListener('pointerup', endDrag);
  window.addEventListener('pointercancel', cancelDrag);
  window.addEventListener('keydown', onDragKey, true);
}
function onDragMove(e: PointerEvent) {
  if (!drag) return;
  if (!drag.moved) {
    if (Math.hypot(e.clientX - drag.x, e.clientY - drag.y) < 6) return;
    drag.moved = true;
    dragging.value = drag.key;
  }
  e.preventDefault();
  const items = Array.from(root.value?.querySelectorAll<HTMLElement>('.q-upload__item') ?? []);
  const over = (document.elementFromPoint(e.clientX, e.clientY) as HTMLElement | null)?.closest('.q-upload__item');
  const to = items.indexOf(over as HTMLElement);
  const from = model.value.findIndex((x) => x.key === drag!.key);
  if (to < 0 || to === from) return;
  const list = [...model.value];
  list.splice(to, 0, ...list.splice(from, 1));
  model.value = list;
}
function stopDrag() {
  window.removeEventListener('pointermove', onDragMove);
  window.removeEventListener('pointerup', endDrag);
  window.removeEventListener('pointercancel', cancelDrag);
  window.removeEventListener('keydown', onDragKey, true);
  dragging.value = null;
  const was = drag;
  drag = null;
  return was;
}
function endDrag() {
  const was = stopDrag();
  if (!was?.moved) return;
  // The click that ends a drag must not open the menu.
  swallowClick = true;
  setTimeout(() => (swallowClick = false));
  const to = model.value.findIndex((x) => x.key === was.key);
  if (to !== was.start.findIndex((x) => x.key === was.key)) announce(model.value[to], to);
  nextTick(() => root.value?.querySelectorAll<HTMLElement>('.q-upload__move')[to]?.focus());
}
function cancelDrag() {
  const was = stopDrag();
  if (was?.moved) model.value = was.start;
}
function onDragKey(e: KeyboardEvent) {
  if (e.key !== 'Escape' || !drag?.moved) return;
  e.preventDefault();
  e.stopPropagation();
  cancelDrag();
}
function onMoveClick(e: MouseEvent) {
  if (!swallowClick) return;
  e.stopPropagation();
  swallowClick = false;
}
onBeforeUnmount(stopDrag);

const hasRoom = computed(() => !props.maxFiles || model.value.length < props.maxFiles || !multiple.value);
const buttonAttrs = computed<Record<string, unknown>>(() => {
  const { class: _c, style: _s, ...rest } = attrs;
  return {
    ...rest,
    id: controlId.value,
    'aria-invalid': isInvalid.value ? 'true' : undefined,
    // Named by the field's label and its own text — "Images, Add images" — not by the label alone.
    'aria-labelledby': rest['aria-label']
      ? undefined
      : joinIds((rest['aria-labelledby'] as string) ?? (controlId.value ? `${controlId.value}-label` : null), textId),
    'aria-describedby': joinIds(
      rest['aria-describedby'] as string | undefined,
      field?.value.describedBy,
      rejects.value.length > 0 && msgId,
    ),
  };
});
function onDragOver(e: DragEvent) {
  if (isDisabled.value) return;
  e.preventDefault();
  over.value = true;
}
function onDragLeave(e: DragEvent) {
  if (!(e.currentTarget as Element).contains(e.relatedTarget as Node | null)) over.value = false;
}
function onDrop(e: DragEvent) {
  e.preventDefault();
  over.value = false;
  add(e.dataTransfer?.files);
}
defineExpose({ add, focus: () => (button.value?.$el as HTMLElement | undefined)?.focus() });
</script>

<template>
  <div
    ref="root"
    :class="[
      'q-upload',
      images && 'q-upload--images',
      isInvalid && 'is-invalid',
      isDisabled && 'is-disabled',
      attrs.class,
    ]"
    :style="attrs.style as any"
  >
    <!-- Images: the grid first, then the add zone. Files: the zone first, then the list. -->
    <template v-for="part in images ? ['list', 'zone'] : ['zone', 'list']" :key="part">
      <div v-if="part === 'zone'">
        <!-- eslint-disable-next-line vuejs-accessibility/no-static-element-interactions -- drag-and-drop target; the "Choose files" button is the keyboard path -->
        <div
          :class="['q-upload__zone', over && 'is-over']"
          @dragover="onDragOver"
          @dragleave="onDragLeave"
          @drop="onDrop"
        >
          <input
            :ref="(el) => (input = el as HTMLInputElement | null)"
            type="file"
            class="q-visually-hidden"
            tabindex="-1"
            aria-hidden="true"
            :accept="accept"
            :multiple="multiple"
            :disabled="isDisabled"
            :name="name"
            @change="add(($event.target as HTMLInputElement).files)"
          />
          <QButton
            :ref="(c) => (button = c as InstanceType<typeof QButton> | null)"
            v-bind="buttonAttrs"
            :size="images ? 'default' : 'slim'"
            :icon-start="images ? 'image' : 'upload'"
            :disabled="isDisabled || !hasRoom"
            @click="input?.click()"
          >
            <span :id="textId">{{ chooseLabel }}</span>
          </QButton>
          <span class="q-upload__hint" aria-hidden="true">{{ multiple ? strings.drop : strings.dropOne }}</span>
        </div>
      </div>
      <div v-else>
        <ul v-if="model.length" :class="['q-upload__list', images && 'q-upload__list--images']">
          <li v-for="(it, i) in model" :key="it.key" :class="['q-upload__item', dragging === it.key && 'is-dragging']">
            <QMenu v-if="canReorder" :label="strings.move(it.name)" :items="moveItems(i)" align="start">
              <template #trigger>
                <button
                  type="button"
                  class="q-upload__move"
                  :aria-label="strings.move(it.name)"
                  :aria-describedby="`${textId}-pos-${i}`"
                  @pointerdown="onMoveDown($event, it)"
                  @keydown="onMoveKey($event, i)"
                  @click.capture="onMoveClick"
                >
                  <QIcon name="grip" size="sm" />
                </button>
              </template>
            </QMenu>
            <span v-if="canReorder" :id="`${textId}-pos-${i}`" hidden>{{ strings.position(i + 1, model.length) }}</span>
            <span v-if="images" class="q-upload__thumb">
              <img v-if="it.url" :src="it.url" alt="" />
              <QIcon v-else name="image" />
            </span>
            <QIcon v-else name="package" size="sm" />
            <span class="q-upload__text">
              <span class="q-upload__name">{{ it.name }}</span>
              <span class="q-upload__meta">
                {{
                  images && i === 0
                    ? strings.main + (it.size ? ` · ${formatSize(it.size)}` : '')
                    : it.size
                      ? formatSize(it.size)
                      : ''
                }}
              </span>
            </span>
            <button
              v-if="!isDisabled"
              type="button"
              class="q-upload__remove"
              :aria-label="strings.remove(it.name)"
              @click="remove(it, i)"
            >
              <QIcon name="x" size="sm" />
            </button>
          </li>
        </ul>
      </div>
    </template>
    <span class="q-visually-hidden" aria-live="polite">{{ announced }}</span>
    <div :id="msgId" class="q-upload__msg" aria-live="polite">
      <div v-for="(r, i) in rejects" :key="i" class="q-field__msg q-field__msg--error">
        <QLead icon="alert-circle" /><span>{{ r }}</span>
      </div>
    </div>
  </div>
</template>
