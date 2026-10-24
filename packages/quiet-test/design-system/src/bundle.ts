// The Quiet design system's bundle: the real Vue components of @frederikhd/quiet, each wrapped as a React component
// so the Design canvas (React 18) can mount them with <x-import component-from-global-scope="Quiet.Button">.
// A wrapped component mounts one Vue app; Quiet components nested inside it (as children or as slot props) join that
// same Vue tree, so Field, RadioGroup, Form and the rest still reach their children. Anything else React renders
// inside goes through a portal, so it keeps its React context.
import * as Q from '@frederikhd/quiet';
import * as Vue from 'vue';
import {
  createApp,
  defineComponent,
  h,
  onBeforeUnmount,
  onMounted,
  onUpdated,
  reactive,
  ref,
  shallowReactive,
  type Component,
  type PropType,
} from 'vue';

/* eslint-disable @typescript-eslint/no-explicit-any */
type ReactNode = any;
const React = (): any => (window as any).React;
const ReactDOM = (): any => (window as any).ReactDOM;
const VUE = Symbol.for('quiet.vue-component');

interface IslandHost {
  set(id: number, el: HTMLElement, node: ReactNode): void;
  del(id: number): void;
}

const UNITLESS = new Set([
  'opacity',
  'zIndex',
  'flex',
  'flexGrow',
  'flexShrink',
  'fontWeight',
  'lineHeight',
  'order',
  'zoom',
  'gridRow',
  'gridColumn',
]);
function styleOf(s: unknown): unknown {
  if (!s || typeof s !== 'object') return s;
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(s)) out[k] = typeof v === 'number' && !UNITLESS.has(k) && v !== 0 ? `${v}px` : v;
  return out;
}

function isNode(v: unknown): boolean {
  const R = React();
  return R.isValidElement(v) || (Array.isArray(v) && v.some((x) => R.isValidElement(x)));
}

/** React children → Vue children. */
function toVue(node: ReactNode, host: IslandHost): any {
  if (node == null || typeof node === 'boolean') return null;
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map((n) => toVue(n, host));
  const R = React();
  if (!R.isValidElement(node)) return null;
  const { type, props, key } = node as { type: any; props: Record<string, any>; key: string | null };
  if (type === R.Fragment) return toVue(props.children, host);
  if (type && type[VUE]) return h(Bridge, { key: key ?? undefined, comp: type[VUE], rprops: props, host });
  // The canvas wraps an element it can select in <div class="sc-host-x" style="display: contents">. Around a Quiet
  // component that wrapper would break the component's own CSS for its children (the first and last tile of a
  // connected RadioGroup, the fields of a FieldGroup), so the component goes in directly and keeps the marker.
  const only = Array.isArray(props.children) && props.children.length === 1 ? props.children[0] : props.children;
  if (
    type === 'div' &&
    props.className === 'sc-host-x' &&
    props.style?.display === 'contents' &&
    Object.keys(props.style).length === 1 &&
    R.isValidElement(only) &&
    (only as { type: any }).type?.[VUE]
  ) {
    const child = only as { type: any; props: Record<string, any>; key: string | null };
    return h(Bridge, {
      key: key ?? child.key ?? undefined,
      comp: child.type[VUE],
      rprops: { ...child.props, 'data-dc-tpl': props['data-dc-tpl'] },
      host,
    });
  }
  if (typeof type === 'string') {
    const p: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(props)) {
      if (k === 'children' || k === 'ref') continue;
      if (k === 'className') p.class = v;
      else if (k === 'htmlFor') p.for = v;
      else if (k === 'style') p.style = styleOf(v);
      else if (k === 'dangerouslySetInnerHTML') p.innerHTML = (v as { __html: string })?.__html;
      else if (k === 'onChange' && (type === 'input' || type === 'textarea')) p.onInput = v;
      else p[k] = v;
    }
    if (key != null) p.key = key;
    return h(type, p, props.dangerouslySetInnerHTML ? undefined : toVue(props.children, host));
  }
  return h(Island, { key: key ?? undefined, node, host });
}

const lcFirst = (s: string) => s.charAt(0).toLowerCase() + s.slice(1);

/** One Quiet component inside the Vue tree, with React-style props mapped onto it. */
const Bridge = defineComponent({
  name: 'QuietBridge',
  props: {
    comp: { type: Object as PropType<Component>, required: true },
    rprops: { type: Object as PropType<Record<string, any>>, required: true },
    host: { type: Object as PropType<IslandHost>, required: true },
  },
  setup(props) {
    // Models the React side leaves uncontrolled (defaultValue, defaultOpen …) live here.
    const local = reactive<Record<string, unknown>>({});
    return () => {
      const comp = props.comp as any;
      const declared: Record<string, unknown> = comp.props ?? {};
      const emits: string[] = Array.isArray(comp.emits) ? comp.emits : Object.keys(comp.emits ?? {});
      const hasModel = 'modelValue' in declared;
      const out: Record<string, any> = {};
      const handlers: Record<string, any> = {};
      const controlled = new Set<string>();
      const slots: Record<string, () => any> = {};
      for (const [k, v] of Object.entries(props.rprops)) {
        if (k === 'children') continue;
        if (k === 'className') out.class = v;
        else if (k === 'style') out.style = styleOf(v);
        else if (isNode(v)) slots[k] = () => toVue(v, props.host);
        else if (/^default[A-Z]/.test(k) && !(k in declared)) {
          const name = /^default(Value|Checked)$/.test(k) ? 'modelValue' : lcFirst(k.slice(7));
          if (!(name in local)) local[name] = v;
        } else if ((k === 'value' || k === 'checked') && hasModel && !(k in declared)) {
          out.modelValue = v;
          controlled.add('modelValue');
        } else if (k === 'onChange' && hasModel && !emits.includes('change')) handlers.modelValue = v;
        else if (/^on[A-Z]\w*Change$/.test(k) && `${lcFirst(k.slice(2, -6))}` in declared) {
          handlers[lcFirst(k.slice(2, -6))] = v;
        } else out[k] = v;
      }
      for (const name of new Set([...Object.keys(local), ...Object.keys(handlers)])) {
        const fns: ((x: unknown) => void)[] = [];
        if (name in local && !controlled.has(name)) {
          out[name] = local[name];
          fns.push((x) => (local[name] = x));
        }
        if (handlers[name]) fns.push(handlers[name]);
        out[`onUpdate:${name}`] = fns.length === 1 ? fns[0] : fns;
      }
      const children = props.rprops.children;
      if (children != null && children !== false) slots.default = () => toVue(children, props.host);
      return h(comp, out, slots);
    };
  },
});

let islands = 0;
/** Something React renders that isn't a Quiet component: a portal target, filled by the wrapper's React tree. */
const Island = defineComponent({
  name: 'QuietReactIsland',
  props: {
    node: { type: null as unknown as PropType<ReactNode>, required: true },
    host: { type: Object as PropType<IslandHost>, required: true },
  },
  setup(props) {
    const el = ref<HTMLElement | null>(null);
    const id = ++islands;
    const sync = () => el.value && props.host.set(id, el.value, props.node);
    onMounted(sync);
    onUpdated(sync);
    onBeforeUnmount(() => props.host.del(id));
    return () => h('span', { ref: el, style: 'display: contents' });
  },
});

function wrap(name: string, comp: Component) {
  function QuietComponent(props: Record<string, any>) {
    const R = React();
    const el = R.useRef(null);
    const state = R.useRef(null);
    const [portals, setPortals] = R.useState(() => new Map());
    R.useLayoutEffect(() => {
      const host: IslandHost = {
        set: (id, target, node) => setPortals((m: Map<number, unknown>) => new Map(m).set(id, { target, node })),
        del: (id) =>
          setPortals((m: Map<number, unknown>) => {
            const n = new Map(m);
            n.delete(id);
            return n;
          }),
      };
      const s = shallowReactive({ props });
      state.current = s;
      const app = createApp({ render: () => h(Bridge, { comp, rprops: s.props, host }) });
      app.mount(el.current);
      return () => {
        app.unmount();
        state.current = null;
      };
    }, []);
    R.useLayoutEffect(() => {
      if (state.current) (state.current as { props: unknown }).props = props;
    });
    return R.createElement(
      R.Fragment,
      null,
      R.createElement('div', { ref: el, style: { display: 'contents' } }),
      [...portals].map(([id, p]: [number, { target: HTMLElement; node: ReactNode }]) =>
        ReactDOM().createPortal(p.node, p.target, String(id)),
      ),
    );
  }
  (QuietComponent as any)[VUE] = comp;
  (QuietComponent as any).displayName = name;
  return QuietComponent;
}

const quiet: Record<string, unknown> = {};
for (const [k, v] of Object.entries(Q)) {
  if (/^Q[A-Z]/.test(k) && v && typeof v === 'object') quiet[k.slice(1)] = wrap(k.slice(1), v as Component);
  else if (k === 'Quiet') quiet.plugin = v;
  else quiet[k] = v;
}
// For components/examples.js (the previews), which shares this Vue and this library.
quiet.__vue = Vue;
quiet.__lib = Q;
(window as any).Quiet = quiet;
