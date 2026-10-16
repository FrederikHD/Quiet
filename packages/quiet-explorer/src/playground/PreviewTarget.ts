// Renders the story's component with the playground's current props, v-model, slots and event listeners.
import { defineComponent, h, type PropType, type VNodeChild } from 'vue';
import type { Story } from '../stories/story';

export default defineComponent({
  name: 'PreviewTarget',
  props: {
    story: { type: Object as PropType<Story>, required: true },
    values: { type: Object as PropType<Record<string, unknown>>, required: true },
    slotText: { type: Object as PropType<Record<string, string>>, required: true },
    events: { type: Array as PropType<string[]>, required: true },
  },
  emits: { event: (_name: string, _args: unknown[]) => true },
  setup(props, { emit }) {
    return () => {
      const listeners: Record<string, (...args: unknown[]) => void> = {};
      for (const name of props.events) {
        const key = `on${name.charAt(0).toUpperCase()}${name.slice(1)}`;
        listeners[key] = (...args: unknown[]) => emit('event', name, args);
      }
      const slots: Record<string, () => VNodeChild> = {};
      for (const [name, content] of Object.entries(props.story.slots ?? {})) {
        slots[name] = typeof content === 'function' ? content : () => props.slotText[name] ?? content;
      }
      const target = () => h(props.story.component, { ...props.values, ...listeners }, slots);
      return props.story.wrap ? props.story.wrap(target) : target();
    };
  },
});
