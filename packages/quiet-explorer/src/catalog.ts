// Everything the explorer knows about the library, gathered from the library itself:
// - groups and order from quiet/src/components.ts (its "// Group" comments),
// - guidelines from each component's README.md,
// - props, events, slots and exposed methods from the TypeScript (virtual:quiet-meta),
// - playground setups from ./stories, examples from ./examples.
// The navigation needs only names and groups. The guidelines, API, playground and examples of a component
// load with its page (loadDetails, awaited by the router), so no page downloads the whole catalogue.
import componentsIndex from '@quiet/src/components.ts?raw';
import type { Component } from 'vue';
import type { ComponentDoc } from '../plugins/quiet-meta';
import type { Story } from './stories/story';

const readmes = import.meta.glob<string>('@quiet/src/components/*/README.md', { query: '?raw', import: 'default' });
const stories = import.meta.glob<Story>('./stories/*.story.ts', { import: 'default' });
const exampleModules = import.meta.glob<Component>('./examples/*/*.vue', { import: 'default' });
const exampleSources = import.meta.glob<string>('./examples/*/*.vue', { query: '?raw', import: 'default' });

export interface Example {
  title: string;
  /** One sentence under the title, from a leading <!-- … --> comment in the example file. */
  description?: string;
  /** Anchor on the Examples tab: "button-variants". */
  id: string;
  component: Component;
  source: string;
}
export interface Entry {
  /** The folder in quiet/src/components: "Button". */
  folder: string;
  slug: string;
  title: string;
  group: string;
  hasStory: boolean;
  exampleCount: number;
}
/** What a component's page shows beyond its guidelines; see loadDetails. */
export interface Details {
  /** The README's first paragraph. */
  summary: string;
  /** The README without its title and first paragraph. */
  readme: string;
  /** The public components in the folder: QPage and QPageColumns. */
  apis: ComponentDoc[];
  story?: Story;
  examples: Example[];
}

// "CheckoutAndFolded" → "Checkout and folded"; acronyms ("RTL") keep their capitals.
const sentenceCase = (name: string) =>
  name
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .split(' ')
    .map((w, i) => (i > 0 && /^[A-Z][a-z]+$/.test(w) ? w.toLowerCase() : w))
    .join(' ');

const slugOf = (folder: string) => folder.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();

function splitReadme(md: string) {
  const body = md.replace(/^# .*\n+/, '');
  const end = body.search(/\n\s*\n/);
  const first = (end === -1 ? body : body.slice(0, end)).trim();
  const rest = end === -1 ? '' : body.slice(end).trim();
  const plain = (s: string) => s.replace(/`([^`]+)`/g, '$1');
  // A paragraph ending in ":" introduces the list after it: the subtitle takes the sentences before that
  // lead-in, and the lead-in stays with its list.
  if (first.endsWith(':')) {
    const cut = first.search(/[.!?]\s+[^.!?]*:$/);
    if (cut !== -1)
      return { summary: plain(first.slice(0, cut + 1)), rest: `${first.slice(cut + 1).trim()}\n\n${rest}` };
  }
  return { summary: plain(first), rest };
}

const examplePaths = (folder: string) =>
  Object.keys(exampleModules)
    .filter((p) => p.startsWith(`./examples/${folder}/`))
    .sort();

async function examplesFor(folder: string): Promise<Example[]> {
  const paths = examplePaths(folder);
  const [modules, sources] = await Promise.all([
    Promise.all(paths.map((p) => exampleModules[p]())),
    Promise.all(paths.map((p) => exampleSources[p]())),
  ]);
  return paths.map((p, i) => {
    // 01-Variants.vue → "Variants"
    const name = p
      .split('/')
      .pop()!
      .replace(/\.vue$/, '')
      .replace(/^\d+-/, '');
    const lead = sources[i].match(/^<!--\s*([\s\S]*?)\s*-->\s*/);
    return {
      title: sentenceCase(name),
      description: lead?.[1].replace(/\s+/g, ' '),
      id: `${slugOf(folder)}-${slugOf(name)}`,
      component: modules[i],
      // The shown source starts at the code: the description is already above it.
      source: lead ? sources[i].slice(lead[0].length) : sources[i],
    };
  });
}

const loaded = new Map<string, Details>();
/** Loads a component's guidelines, API, playground setup and examples (once; the router awaits it before showing the page). */
export async function loadDetails(entry: Entry): Promise<Details> {
  const cached = loaded.get(entry.folder);
  if (cached) return cached;
  const story = stories[`./stories/${entry.folder}.story.ts`];
  const readme = readmes[Object.keys(readmes).find((k) => k.endsWith(`/components/${entry.folder}/README.md`)) ?? ''];
  const [md, meta, storyValue, examples] = await Promise.all([
    readme?.() ?? '',
    import('virtual:quiet-meta').then((m) => m.default),
    story?.(),
    examplesFor(entry.folder),
  ]);
  const { summary, rest } = splitReadme(md);
  const details = {
    summary,
    readme: rest,
    apis: Object.values(meta).filter((d) => d.folder === entry.folder),
    story: storyValue,
    examples,
  };
  loaded.set(entry.folder, details);
  return details;
}
/** The details loadDetails already loaded. */
export function detailsOf(entry: Entry): Details {
  const details = loaded.get(entry.folder);
  if (!details) throw new Error(`Details of ${entry.folder} are not loaded yet`);
  return details;
}

export const entries: Entry[] = [];
let group = '';
for (const line of componentsIndex.split('\n')) {
  const g = line.match(/^\/\/ (.+)$/);
  if (g && !g[1].startsWith('Every component')) group = g[1];
  const c = line.match(/^export \* from '\.\/components\/(\w+)';/);
  if (!c) continue;
  const folder = c[1];
  entries.push({
    folder,
    slug: slugOf(folder),
    title: folder,
    group,
    hasStory: `./stories/${folder}.story.ts` in stories,
    exampleCount: examplePaths(folder).length,
  });
}

export const groups = [...new Set(entries.map((e) => e.group))].map((name) => ({
  name,
  entries: entries.filter((e) => e.group === name),
}));
