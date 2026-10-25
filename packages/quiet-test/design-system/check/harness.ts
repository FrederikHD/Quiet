// The check page: renders a component's playground story twice — straight in Vue, and through the design system's
// React bridge the way a claude.ai design canvas mounts it (children always in an array, every nested component in
// the canvas's <div class="sc-host-x"> selection wrapper) — so check.mjs can compare the two.
import { createApp, Fragment, h, Text, type Component, type VNode } from 'vue';
import * as Q from '@frederikhd/quiet';
import type { Story } from '../../../quiet-explorer/src/stories/story';

/* eslint-disable @typescript-eslint/no-explicit-any */
const modules = import.meta.glob<Story>('../../../quiet-explorer/src/stories/*.story.ts', {
  eager: true,
  import: 'default',
});
const stories: Record<string, Story> = Object.fromEntries(
  Object.entries(modules).map(([p, s]) => [p.split('/').pop()!.replace('.story.ts', ''), s]),
);
const R = (): any => (window as any).React;
const ReactDOM = (): any => (window as any).ReactDOM;
const QuietReact = (): Record<string, any> => (window as any).Quiet;
const nameOf = new Map<unknown, string>(
  Object.entries(Q)
    .filter(([k]) => /^Q[A-Z]/.test(k))
    .map(([k, v]) => [v, k.slice(1)]),
);

const values = (story: Story) => {
  const v: Record<string, unknown> = { ...story.props };
  if (story.model) v[story.model.prop ?? 'modelValue'] = story.model.value;
  return v;
};
const slotsOf = (story: Story) =>
  Object.fromEntries(
    Object.entries(story.slots ?? {}).map(([k, c]) => [k, typeof c === 'function' ? c : () => c]),
  ) as Record<string, () => any>;

function mountVue(el: HTMLElement, story: Story) {
  const target = () => h(story.component, values(story), slotsOf(story));
  const shown = () => (story.wrap ? story.wrap(target) : target());
  const app = createApp({
    render: () => (story.field ? h(Q.QField, { label: story.field.label, hint: story.field.hint }, shown) : shown()),
  });
  app.mount(el);
}

// ---- The same story as React elements, the way the canvas builds them ----
const host = (child: any, key: number | string) =>
  R().createElement(
    'div',
    { key, className: 'sc-host-x', 'data-dc-tpl': `t${key}`, style: { display: 'contents' } },
    child,
  );
const kebabToCamel = (s: string) => s.replace(/-(\w)/g, (_, c) => c.toUpperCase());
/** A style string as React wants it ("width: 240px" → { width: '240px' }), as the canvas passes it. */
const styleObject = (style: unknown) =>
  typeof style !== 'string'
    ? style
    : Object.fromEntries(
        style
          .split(';')
          .map((d) => d.split(/:(.*)/s).map((x) => x.trim()))
          .filter(([k, v]) => k && v)
          .map(([k, v]) => [k.startsWith('--') ? k : kebabToCamel(k), v]),
      );

/** React props for a Quiet component: v-model as defaultValue / defaultOpen …, events as on*. */
function reactProps(props: Record<string, any>) {
  const out: Record<string, any> = {};
  for (const [k, v] of Object.entries(props ?? {})) {
    if (k === 'modelValue') out.defaultValue = v;
    else if (k === 'class') out.className = v;
    else if (k.startsWith('onUpdate:')) continue;
    else out[kebabToCamel(k)] = v;
  }
  return out;
}

/** A Vue VNode (from a story's slot or wrap) as React elements; `marker` stands for the story's own component. */
function toReact(node: any, marker: any, key: number | string = 0): any {
  if (node == null || typeof node === 'boolean') return null;
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map((n, i) => toReact(n, marker, i));
  const v = node as VNode;
  if (v.type === Text) return String(v.children);
  if (v.type === Fragment) return toReact(v.children, marker, key);
  if (v.type === 'quiet-target') return marker;
  const kids = (c: any): any[] => {
    if (c == null) return [];
    if (typeof c === 'string') return [c];
    if (Array.isArray(c)) return c.map((n, i) => toReact(n, marker, i));
    if (typeof c === 'object' && typeof c.default === 'function') return [toReact(c.default(), marker)].flat();
    return [];
  };
  if (typeof v.type === 'string') {
    const p: Record<string, any> = { key };
    for (const [k, val] of Object.entries(v.props ?? {}))
      p[k === 'class' ? 'className' : k === 'for' ? 'htmlFor' : k] = k === 'style' ? styleObject(val) : val;
    return R().createElement(v.type, p, ...kids(v.children));
  }
  const name = nameOf.get(v.type);
  if (!name) throw new Error('A story renders something that is not a Quiet component');
  const p: Record<string, any> = { ...reactProps(v.props as Record<string, any>), key };
  const slots = v.children as any;
  if (slots && typeof slots === 'object' && !Array.isArray(slots)) {
    for (const [s, fn] of Object.entries(slots)) {
      if (typeof fn !== 'function' || s.startsWith('_')) continue;
      const content = toReact((fn as () => any)(), marker);
      if (s === 'default') p.children = [content].flat();
      else p[kebabToCamel(s)] = content;
    }
  } else if (typeof slots === 'string') p.children = [slots];
  return host(R().createElement(QuietReact()[name], p), key);
}

function storyElement(story: Story, model?: unknown) {
  const name = nameOf.get(story.component)!;
  const p: Record<string, any> = reactProps({
    ...values(story),
    ...(model !== undefined ? { [story.model?.prop ?? 'modelValue']: model } : {}),
  });
  if (story.model?.prop && story.model.prop !== 'modelValue') {
    const cap = story.model.prop.charAt(0).toUpperCase() + story.model.prop.slice(1);
    p[`default${cap}`] = model !== undefined ? model : story.model.value;
    delete p[story.model.prop];
  }
  for (const [s, c] of Object.entries(story.slots ?? {})) {
    const content = typeof c === 'function' ? toReact(c(), null) : c;
    if (s === 'default') p.children = [content].flat();
    else p[kebabToCamel(s)] = content;
  }
  const own = R().createElement(QuietReact()[name], p);
  const shown = story.wrap
    ? toReact(
        story.wrap(() => h('quiet-target')),
        host(own, 'own'),
      )
    : own;
  return story.field
    ? R().createElement(QuietReact().Field, {
        label: story.field.label,
        hint: story.field.hint,
        children: [story.wrap ? shown : host(shown, 'field')],
      })
    : shown;
}

function mountReact(el: HTMLElement, story: Story, model?: unknown) {
  ReactDOM().createRoot(el).render(storyElement(story, model));
}

// Beyond the stories: scoped slots, which a canvas passes as render props, and slots with kebab-case names.
const orders = [
  { id: '#10500', customer: 'Anna Schmidt', status: 'Unfulfilled' },
  { id: '#10499', customer: 'Noah Koch', status: 'Shipped' },
];
const tableProps = {
  caption: 'Orders',
  rowKey: 'id',
  selectable: true,
  defaultSelected: ['#10499'],
  columns: [
    { key: 'id', header: 'Order' },
    { key: 'customer', header: 'Customer' },
    { key: 'status', header: 'Status' },
  ],
  rows: orders,
};
const tone = (status: string) => (status === 'Shipped' ? 'info' : 'warning');
const extras: Record<string, { vue: () => any; react: () => any }> = {
  'Table (scoped slots)': {
    vue: () =>
      h(
        Q.QPage,
        { title: 'Orders' },
        {
          'title-meta': () => h(Q.QBadge, { tone: 'info' }, () => 'Live'),
          default: () =>
            h(Q.QTable, tableProps, {
              'cell-status': ({ row }: any) => h(Q.QBadge, { tone: tone(row.status) }, () => row.status),
              'row-actions': ({ row }: any) =>
                h(Q.QButton, { size: 'slim', variant: 'ghost', 'aria-label': `Open ${row.id}` }, () => 'Open'),
              'bulk-actions': ({ selected }: any) => h(Q.QButton, { size: 'slim' }, () => `Fulfil ${selected.length}`),
            }),
        },
      ),
    react: () => {
      const el = R().createElement;
      const Quiet = QuietReact();
      return el(Quiet.Page, {
        title: 'Orders',
        titleMeta: host(el(Quiet.Badge, { tone: 'info', children: ['Live'] }), 'meta'),
        children: [
          host(
            el(Quiet.Table, {
              ...tableProps,
              'cell-status': ({ row }: any) => el(Quiet.Badge, { tone: tone(row.status), children: [row.status] }),
              rowActions: ({ row }: any) =>
                el(Quiet.Button, { size: 'slim', variant: 'ghost', ariaLabel: `Open ${row.id}`, children: ['Open'] }),
              bulkActions: ({ selected }: any) =>
                el(Quiet.Button, { size: 'slim', children: [`Fulfil ${selected.length}`] }),
            }),
            'table',
          ),
        ],
      });
    },
  },
};

(window as any).QuietCheck = {
  names: () => [...Object.keys(stories).sort(), ...Object.keys(extras)],
  story: (name: string) => stories[name] as Story & { component: Component },
  mount(name: string) {
    if (extras[name]) {
      createApp({ render: extras[name].vue }).mount(document.getElementById('vue')!);
      ReactDOM().createRoot(document.getElementById('react')!).render(extras[name].react());
      return;
    }
    const story = stories[name];
    mountVue(document.getElementById('vue')!, story);
    mountReact(document.getElementById('react')!, story);
  },
  /** Only through the bridge, with the v-model set: an open Dialog. */
  mountCanvas(name: string, model?: unknown) {
    mountReact(document.getElementById('react')!, stories[name], model);
  },
};
