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
  /** For playground controls: the literal values of a union, or a basic kind. */
  control: { kind: 'boolean' } | { kind: 'string' } | { kind: 'number' } | { kind: 'enum'; values: string[] } | { kind: 'other' };
}
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

function control(schema: PropertyMetaSchema, type: string): PropMeta['control'] {
  const parts =
    typeof schema === 'object' && schema.kind === 'enum'
      ? (schema.schema ?? []).map((s) => (typeof s === 'string' ? s : s.type)).filter((s) => s !== 'undefined')
      : [typeof schema === 'string' ? schema : type];
  if (parts.length && parts.every((p) => p === 'boolean' || p === 'true' || p === 'false')) return { kind: 'boolean' };
  if (parts.length && parts.every((p) => /^".*"$/.test(p))) return { kind: 'enum', values: parts.map((p) => JSON.parse(p)) };
  if (parts.length && parts.every((p) => /^-?\d+$/.test(p))) return { kind: 'enum', values: parts };
  if (parts.length === 1 && parts[0] === 'string') return { kind: 'string' };
  if (parts.length === 1 && parts[0] === 'number') return { kind: 'number' };
  if (parts.includes('string') && parts.every((p) => p === 'string' || p === 'null')) return { kind: 'string' };
  return { kind: 'other' };
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
