// components/index.d.ts for the design system: one namespace with each component's props as the canvas takes them,
// generated from the library's built types (dist/types). The artifact reads <Comp>Props for its API cards.
import { existsSync, readFileSync, readdirSync } from 'node:fs';

const camel = (s) => s.replace(/-(\w)/g, (_, c) => c.toUpperCase());

/** The declarations of a file, without imports, re-exports and `declare` (they sit in a namespace). */
function clean(src) {
  return src
    .replace(/^import [\s\S]*?;\n/gm, '')
    .replace(/^export \{[^}]*\};?\n?/gm, '')
    .replace(/^export \*.*\n/gm, '')
    .replaceAll('export declare ', 'export ')
    .replaceAll('declare const ', 'const ')
    .replaceAll('declare function ', 'function ');
}

/** A .vue.d.ts up to vue-tsc's generated helpers: the component's own interfaces and types. */
function head(src) {
  const cuts = ['type __VLS_', 'declare const __VLS_', 'declare const _default', 'declare var __VLS_']
    .map((m) => src.indexOf(m))
    .filter((i) => i !== -1);
  return src.slice(0, Math.min(src.length, ...cuts));
}

export function indexDts(types) {
  const read = (p) => readFileSync(`${types}/${p}`, 'utf8');
  const out = [
    '// The props of each component in window.Quiet, generated from @frederikhd/quiet. On a canvas a component takes',
    '// its Vue props as they are, plus value / defaultValue / onChange for its v-model (defaultOpen / onOpenChange …',
    '// for named models), slots as props holding content (children = the default slot), and className / style.',
    'declare namespace Quiet {',
    'type InjectionKey<T> = symbol;',
    'type ComputedRef<T> = { readonly value: T };',
    'type HTMLAttributes = Record<string, unknown>;',
  ];
  const choice = read('internal/useChoiceGroup.d.ts');
  out.push(choice.match(/export type ChoiceLayout = [^;]+;/)[0].replace('export ', ''));
  const inherited = choice.match(/export interface ChoiceGroupProps[^{]*\{([\s\S]*?)\n\}/)[1];

  // Shared types: ImageSource, ItemKey, ComboboxOption, IconName …
  const dirs = readdirSync(`${types}/components`).sort();
  out.push(clean(read('types.d.ts')));
  for (const d of dirs)
    for (const f of readdirSync(`${types}/components/${d}`).sort())
      if (f.endsWith('.d.ts') && !f.endsWith('.vue.d.ts') && f !== 'index.d.ts')
        out.push(`// ${d}/${f}`, clean(read(`components/${d}/${f}`)));

  const exports = [];
  for (const d of dirs) {
    for (const [, name] of read(`components/${d}/index.d.ts`).matchAll(/default as Q(\w+)/g)) {
      const file = `components/${d}/Q${name}.vue.d.ts`;
      if (!existsSync(`${types}/${file}`)) continue;
      const src = read(file);
      // Inherited props written out, so the props table shows them all.
      let body = clean(head(src)).replace(
        /(export interface \w+Props) extends ChoiceGroupProps \{/,
        (_, start) => `${start} {${inherited}`,
      );
      const has = (member) => new RegExp(`\\n\\s+${member}\\??:`).test(body);
      const extra = [];
      // Slots → props holding content; scoped slots → render props. (Generic components list them under `slots:`.)
      const slots =
        src.match(/type __VLS_Slots = \{([\s\S]*?)\n\};/) ?? src.match(/\n {4}slots: \{([\s\S]*?)\n {4}\};/);
      const generic = body.match(new RegExp(`export interface ${name}Props<(\\w+)`))?.[1];
      const scope = (args) => args.replace(/\s+/g, ' ').replace(/\bRow\b/g, generic ?? 'Record<string, unknown>');
      if (slots) {
        for (const [, doc = '', slot, args] of slots[1].matchAll(
          /(\/\*\*[\s\S]*?\*\/\s*)?('[\w-]+'|\w+)\?\(([^()]*)\)/g,
        )) {
          const prop = slot === 'default' ? 'children' : camel(slot.replace(/'/g, ''));
          const type = args.trim() ? `(${scope(args)}) => React.ReactNode` : 'React.ReactNode';
          extra.push([prop, `${doc.trim() ? `${doc.trim()}\n    ` : ''}${prop}?: ${type};`]);
        }
        // Slots named by pattern: Table's 'cell-status', 'header-total'.
        for (const [, pattern, args] of slots[1].matchAll(
          /\[x: (`[\w-]+\$\{string\}`)\]: \(\(([^()]*)\) => unknown\)/g,
        ))
          extra.push([
            pattern,
            `[slot: ${pattern}]: ${args.trim() ? `((${scope(args)}) => React.ReactNode)` : 'React.ReactNode'} | undefined;`,
          ]);
      }
      // Events → on* callbacks; models → value / defaultX / onXChange.
      for (const [, event, args] of src.matchAll(/"?(on[A-Z][\w:]*)"?\?: \(\((.*?)\) => any\) \| undefined;/g)) {
        if (!event.startsWith('onUpdate:')) {
          extra.push([event, `${event}?: (${args}) => void;`]);
          continue;
        }
        const model = event.slice(9);
        const type = body.match(new RegExp(`\\n\\s+${model}\\??: ([^;]+);`))?.[1] ?? 'unknown';
        if (model === 'modelValue') {
          extra.push(['value', `/** Controlled value (the v-model). */\n    value?: ${type};`]);
          extra.push([
            'defaultValue',
            `/** Starting value, left to the component after that. */\n    defaultValue?: ${type};`,
          ]);
          extra.push(['onChange', `/** The new value. */\n    onChange?: (${args}) => void;`]);
        } else {
          const cap = model.charAt(0).toUpperCase() + model.slice(1);
          extra.push([`default${cap}`, `default${cap}?: ${type};`]);
          extra.push([`on${cap}Change`, `on${cap}Change?: (${args}) => void;`]);
        }
      }
      extra.push(['className', '/** On the outer element. */\n    className?: string;']);
      extra.push(['style', 'style?: React.CSSProperties;']);
      const seen = new Set();
      const members = extra.filter(([n]) => !has(n) && !seen.has(n) && seen.add(n)).map(([, text]) => text);

      body = body.replace(new RegExp(`(export interface ${name}Props)<(\\w+)>`), '$1<$2 = Record<string, unknown>>');
      const start = body.match(new RegExp(`export interface ${name}Props(?:<[^>]*>+)?(?: extends [^{]+)? \\{`));
      const add = members.map((m) => `    ${m}\n`).join('');
      if (start) {
        // Before the interface's closing brace.
        let i = start.index + start[0].length;
        for (let depth = 1; depth; i++) depth += body[i] === '{' ? 1 : body[i] === '}' ? -1 : 0;
        body = body.slice(0, i - 1) + add + body.slice(i - 1);
      } else body += `export interface ${name}Props {\n${add}}\n`;
      out.push(`// ${d}/Q${name}`, body);
      exports.push(`export const ${name}: React.FC<${name}Props>;`);
    }
  }
  out.push('// config', clean(read('config.d.ts')), ...exports);
  const text = out
    .join('\n')
    .replace(/import\("[^"]+"\)\./g, '')
    .split('\n')
    .map((l, i) => (i < 4 || !l.trim() ? l : `  ${l}`))
    .join('\n');
  return `${text}\n}\n`;
}
