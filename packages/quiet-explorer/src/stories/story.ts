import type { Component, VNodeChild } from 'vue';

/**
 * How a component shows up in the playground. Controls are generated from the component's props
 * (virtual:quiet-meta); a story only says what to start with.
 */
export interface Story {
  /** The component the playground renders. */
  component: Component;
  /** Its tag in the generated code: "QButton". */
  name: string;
  /** Starting props. Objects and arrays without functions can be edited as JSON. */
  props?: Record<string, unknown>;
  /** The component's v-model: which prop ('modelValue', 'open', 'page' …) and its starting value. */
  model?: { prop?: string; value: unknown };
  /** Slot content: text (editable in the playground) or a render function. */
  slots?: Record<string, string | (() => VNodeChild)>;
  /** Props the playground sets itself and must not be changed (AppShell's contained). Listed, not hidden silently. */
  hide?: string[];
  /** Put the component in a Field with this label (for bare controls such as Input). */
  field?: { label: string; hint?: string };
  /** Overlays: show a button that sets the v-model to true. */
  opener?: string;
  /** Render the component inside something (a Radio inside a RadioGroup). Not shown in the generated code. */
  wrap?: (target: () => VNodeChild) => VNodeChild;
  /** How the preview lays it out: centred (default) or full width. */
  layout?: 'center' | 'block';
}

export const defineStory = (story: Story): Story => story;
