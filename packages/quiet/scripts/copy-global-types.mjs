// The global component types (for app.use(Quiet)) import './components', so they ship next to the generated
// declarations in dist/types, where that path resolves: "types": ["@frederikhd/quiet/global"].
import { copyFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
copyFileSync(`${root}src/global-components.d.ts`, `${root}dist/types/global.d.ts`);
