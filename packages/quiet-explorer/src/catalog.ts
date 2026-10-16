// Everything the explorer knows about the library, gathered from the library itself:
// - groups and order from quiet/src/components.ts (its "// Group" comments),
// - guidelines from each component's README.md,
// - props, events, slots and exposed methods from the TypeScript (virtual:quiet-meta),
// - playground setups from ./stories, examples from ./examples.
import componentsIndex from '@quiet/src/components.ts?raw';
import meta from 'virtual:quiet-meta';
import type { Component } from 'vue';
import type { ComponentDoc } from '../plugins/quiet-meta';
import type { Story } from './stories/story';

const readmes = import.meta.glob<string>('@quiet/src/components/*/README.md', { query: '?raw', import: 'default', eager: true });
const stories = import.meta.glob<Story>('./stories/*.story.ts', { import: 'default', eager: true });
const exampleModules = import.meta.glob<Component>('./examples/*/*.vue', { import: 'default', eager: true });
const exampleSources = import.meta.glob<string>('./examples/*/*.vue', { query: '?raw', import: 'default', eager: true });

export interface Example {
  title: string;
  component: Component;
  source: string;
}
export interface Entry {
  /** The folder in quiet/src/components: "Button". */
  folder: string;
  slug: string;
  title: string;
  group: string;
  /** The README's first paragraph. */
  summary: string;
  /** The README without its title and first paragraph. */
  readme: string;
  /** The public components in the folder: QPage and QPageColumns. */
  apis: ComponentDoc[];
  story?: Story;
  examples: Example[];
}

const slugOf = (folder: string) => folder.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();

function splitReadme(md: string) {
  const body = md.replace(/^# .*\n+/, '');
  const end = body.search(/\n\s*\n/);
  const summary = (end === -1 ? body : body.slice(0, end)).trim().replace(/`([^`]+)`/g, '$1');
  return { summary, rest: end === -1 ? '' : body.slice(end).trim() };
}

function examplesFor(folder: string): Example[] {
  return Object.keys(exampleModules)
    .filter((p) => p.startsWith(`./examples/${folder}/`))
    .sort()
    .map((p) => ({
      // 01-Variants.vue → "Variants"
      title: p.split('/').pop()!.replace(/\.vue$/, '').replace(/^\d+-/, '').replace(/([a-z])([A-Z])/g, '$1 $2'),
      component: exampleModules[p],
      source: exampleSources[p],
    }));
}

export const entries: Entry[] = [];
let group = '';
for (const line of componentsIndex.split('\n')) {
  const g = line.match(/^\/\/ (.+)$/);
  if (g && !g[1].startsWith('Every component')) group = g[1];
  const c = line.match(/^export \* from '\.\/components\/(\w+)';/);
  if (!c) continue;
  const folder = c[1];
  const md = readmes[Object.keys(readmes).find((k) => k.endsWith(`/components/${folder}/README.md`)) ?? ''] ?? '';
  const { summary, rest } = splitReadme(md);
  entries.push({
    folder,
    slug: slugOf(folder),
    title: folder,
    group,
    summary,
    readme: rest,
    apis: Object.values(meta).filter((d) => d.folder === folder),
    story: stories[`./stories/${folder}.story.ts`],
    examples: examplesFor(folder),
  });
}

export const groups = [...new Set(entries.map((e) => e.group))].map((name) => ({
  name,
  entries: entries.filter((e) => e.group === name),
}));
