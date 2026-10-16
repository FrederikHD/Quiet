// The component folders of the library, read from disk, so a new component is tested without touching this package.
import { readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../../quiet/src/components', import.meta.url));

export const components = readdirSync(root, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name)
  .sort();

export const slugOf = (folder: string) => folder.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
