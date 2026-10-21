// The component folders of the library and the explorer's patterns and guides, read from disk, so a new component,
// pattern or guide is tested without touching this package.
import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../../quiet/src/components', import.meta.url));

export const components = readdirSync(root, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name)
  .sort();

/** The pattern pages (/patterns/<slug>), from the slugs in the explorer's pattern list. */
export const patterns = [
  ...readFileSync(
    fileURLToPath(new URL('../../quiet-explorer/src/patterns/index.ts', import.meta.url)),
    'utf8',
  ).matchAll(/slug: '([a-z-]+)'/g),
].map((m) => `/patterns/${m[1]}`);

/** The guide pages (/guides/<slug>), from the slugs in the explorer's guide list. */
export const guides = [
  ...readFileSync(fileURLToPath(new URL('../../quiet-explorer/src/guides/index.ts', import.meta.url)), 'utf8').matchAll(
    /slug: '([a-z-]+)'/g,
  ),
].map((m) => `/guides/${m[1]}`);

export const slugOf = (folder: string) => folder.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
