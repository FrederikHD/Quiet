// A Vite plugin that reads every Quiet component's TypeScript (props with their JSDoc, events, slots, exposed
// methods) with vue-component-meta, and serves it as `virtual:quiet-meta`. The explorer's API tables and the
// playground's controls come from here, so they can never drift from the code.
import { readdirSync, readFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import type { Plugin } from 'vite';
import { createChecker, type ComponentMeta, type PropertyMetaSchema } from 'vue-component-meta';

export interface PropMeta {
  name: string;
  type: string;
  required: boolean;
  default?: string;
  description: string;
  /** How the playground edits it. Every prop gets one; only functions and DOM elements are left to code. */
  control: PropControl;
}
export type PropControl =
  | { kind: 'boolean' }
  | { kind: 'string' }
  | { kind: 'number' }
  /** A union of literals; `values` are their JSON texts ('"md"', '2', 'true', 'null'). */
  | { kind: 'enum'; values: string[] }
  /** Objects, arrays and records, edited as JSON. */
  | { kind: 'json' }
  /** Functions and elements: they can only be passed from code. */
  | { kind: 'code'; reason: string };
export interface ComponentDoc {
  name: string;
  folder: string;
  file: string;
  props: PropMeta[];
  events: { name: string; type: string; description: string }[];
  slots: { name: string; type: string; description: string }[];
  exposed: { name: string; type: string; description: string }[];
}

const VIRTUAL = 'virtual:quiet-meta';
const RESOLVED = '\0' + VIRTUAL;

function control(schema: PropertyMetaSchema, type: string): PropControl {
  // vue-component-meta marks function types (even behind an alias such as ComboboxSearch) as kind "event".
  const text = (sc: PropertyMetaSchema) => (typeof sc === 'string' ? sc : sc.kind === 'event' ? '(…) => unknown' : sc.type);
  const parts = (typeof schema === 'object' && schema.kind === 'enum' ? (schema.schema ?? []).map(text) : [text(schema) || type])
    .flatMap((p) => (p === 'boolean' ? ['true', 'false'] : [p.trim()]))
    .filter((p) => p !== 'undefined');
  const literal = (p: string) => /^".*"$/.test(p) || /^-?\d+(\.\d+)?$/.test(p) || p === 'true' || p === 'false' || p === 'null';
  const isFunction = (p: string) => /=>/.test(p) && !/^[{[]/.test(p);
  const values = parts.filter((p) => p !== 'null');

  if (parts.length && parts.every((p) => p === 'true' || p === 'false')) return { kind: 'boolean' };
  if (parts.length && parts.every(literal)) return { kind: 'enum', values: parts };
  // A function or element alternative is for code; the playground edits the plain part ("id" | (row) => key).
  const plain = values.filter((p) => !isFunction(p) && !/HTMLElement|Element\b/.test(p));
  if (plain.length && plain.every((p) => p === 'string' || p === 'number' || literal(p))) {
    return plain.includes('string') ? { kind: 'string' } : { kind: 'number' };
  }
  if (!plain.length && values.some(isFunction)) return { kind: 'code', reason: 'a function' };
  if (!plain.length) return { kind: 'code', reason: 'an element' };
  return { kind: 'json' };
}

/** The public components: what each folder's index.ts exports as `default as Q…`. */
function publicComponents(componentsDir: string) {
  const out: { name: string; folder: string; file: string }[] = [];
  for (const folder of readdirSync(componentsDir)) {
    let index: string;
    try {
      index = readFileSync(join(componentsDir, folder, 'index.ts'), 'utf8');
    } catch {
      continue;
    }
    for (const m of index.matchAll(/export \{ default as (Q\w+) \} from '\.\/(Q\w+)\.vue'/g)) {
      out.push({ name: m[1], folder, file: join(componentsDir, folder, `${m[2]}.vue`) });
    }
  }
  return out;
}

export function quietMeta(options: { libraryRoot: string }): Plugin {
  const componentsDir = join(options.libraryRoot, 'src/components');
  let checker: ReturnType<typeof createChecker> | null = null;

  function build(): Record<string, ComponentDoc> {
    checker ??= createChecker(join(options.libraryRoot, 'tsconfig.json'), {
      forceUseTs: true,
      printer: { newLine: 1 },
      schema: { ignore: ['HTMLElement', 'MouseEvent', 'KeyboardEvent', 'SubmitEvent', 'Event'] },
    });
    const docs: Record<string, ComponentDoc> = {};
    for (const c of publicComponents(componentsDir)) {
      const meta: ComponentMeta = checker.getComponentMeta(c.file);
      docs[c.name] = {
        name: c.name,
        folder: c.folder,
        file: relative(options.libraryRoot, c.file),
        props: meta.props
          .filter((p) => !p.global && !p.name.startsWith('on'))
          .map((p) => ({
            name: p.name,
            type: p.type.replace(/ \| undefined$/, ''),
            required: p.required,
            default: p.default && p.default !== 'undefined' ? p.default : undefined,
            description: p.description,
            control: control(p.schema, p.type),
          })),
        events: meta.events.map((e) => ({ name: e.name, type: e.type, description: e.description })),
        slots: meta.slots.map((s) => ({ name: s.name, type: s.type, description: s.description })),
        exposed: meta.exposed
          .filter((e) => !e.name.startsWith('$') && !meta.props.some((p) => p.name === e.name))
          .map((e) => ({ name: e.name, type: e.type, description: e.description })),
      };
    }
    return docs;
  }

  return {
    name: 'quiet-meta',
    resolveId(id) {
      return id === VIRTUAL ? RESOLVED : undefined;
    },
    load(id) {
      if (id !== RESOLVED) return undefined;
      return `export default ${JSON.stringify(build())};`;
    },
    handleHotUpdate(ctx) {
      // A component's types changed: re-read them and reload the explorer's view of them.
      if (!ctx.file.startsWith(options.libraryRoot) || !/\.(vue|ts)$/.test(ctx.file)) return;
      checker?.reload();
      const mod = ctx.server.moduleGraph.getModuleById(RESOLVED);
      if (mod) {
        ctx.server.moduleGraph.invalidateModule(mod);
        return [...ctx.modules, mod];
      }
    },
  };
}
