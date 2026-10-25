// Builds the Quiet design system for claude.ai (the "Design System" artifact) from this repository, and nothing else:
// the library's components, tokens, guidelines and guides, and the explorer's examples as previews. The files land in
// design-system/out/project/, at the paths the artifact keeps them; publishing them is a separate step (see README).
//   npm run design-system          (from the root: builds the library first)
import { execFileSync } from 'node:child_process';
import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import vue from '@vitejs/plugin-vue';
import { build } from 'vite';
import { indexDts } from './index-dts.mjs';

const here = fileURLToPath(new URL('.', import.meta.url));
const root = fileURLToPath(new URL('../../../', import.meta.url));
const lib = `${root}packages/quiet`;
const examplesDir = `${root}packages/quiet-explorer/src/examples`;
const out = `${here}out/project`;
const read = (p) => readFileSync(p, 'utf8');
// Scripts as plain ASCII (non-ASCII written as \u escapes): a page that loads them without declaring UTF-8 would
// otherwise misread characters in strings and regular expressions.
const ascii = (js) => js.replace(/[\u0080-\uffff]/g, (c) => `\\u${c.charCodeAt(0).toString(16).padStart(4, '0')}`);

if (!existsSync(`${lib}/dist/quiet.js`)) throw new Error('Build the library first: npm run build -w @frederikhd/quiet');
rmSync(`${here}out`, { recursive: true, force: true });
mkdirSync(`${out}/components`, { recursive: true });

const pkg = JSON.parse(read(`${lib}/package.json`));
const sha = execFileSync('git', ['rev-parse', '--short', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim();
const branch = execFileSync('git', ['rev-parse', '--abbrev-ref', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim();

// Components by group, in the order of components.ts ("// Forms" …).
const groups = {};
let group = '';
for (const line of read(`${lib}/src/components.ts`).split('\n')) {
  const g = /^\/\/ (.+)/.exec(line);
  if (g && !g[1].startsWith('Every component')) group = g[1];
  const c = /components\/(\w+)'/.exec(line);
  if (c) groups[c[1]] = group;
}
const exported = readdirSync(`${lib}/dist/types/components`).flatMap((d) =>
  [...read(`${lib}/dist/types/components/${d}/index.d.ts`).matchAll(/default as Q(\w+)/g)].map((m) => m[1]),
);

const production = { 'process.env.NODE_ENV': '"production"' };

// 1. components/bundle.js: every component, wrapped for React (src/bundle.ts), with Vue and the library inside.
await build({
  configFile: false,
  logLevel: 'warn',
  define: { ...production, __VUE_OPTIONS_API__: 'true', __VUE_PROD_DEVTOOLS__: 'false' },
  build: {
    outDir: `${out}/components`,
    emptyOutDir: false,
    minify: true,
    lib: { entry: `${here}src/bundle.ts`, formats: ['iife'], name: 'QuietBundle', fileName: () => 'bundle.js' },
  },
});
const header = { format: 4, namespace: 'Quiet', components: exported.map((name) => ({ name })) };
const bundle = `/* @ds-bundle: ${JSON.stringify(header)} */\n${ascii(read(`${out}/components/bundle.js`))}`;
// The artifact may inline it in a <script>.
if (/<\/script|<!--/i.test(bundle)) throw new Error('bundle.js contains </script or <!--');
writeFileSync(`${out}/components/bundle.js`, bundle);
cpSync(`${lib}/dist/quiet.css`, `${out}/components/bundle.css`);

// 2. components/examples.js: the explorer's examples for the previews, using the bundle's Vue and library.
const descriptions = {};
for (const folder of readdirSync(examplesDir))
  for (const file of readdirSync(`${examplesDir}/${folder}`)) {
    const lead = read(`${examplesDir}/${folder}/${file}`).match(/^<!--\s*([\s\S]*?)\s*-->/);
    if (lead) descriptions[`${folder}/${file}`] = lead[1].replace(/\s+/g, ' ');
  }
await build({
  configFile: false,
  logLevel: 'warn',
  plugins: [
    vue(),
    {
      name: 'example-descriptions',
      resolveId: (id) => (id === 'virtual:example-descriptions' ? '\0descriptions' : null),
      load: (id) => (id === '\0descriptions' ? `export default ${JSON.stringify(descriptions)};` : null),
    },
  ],
  define: production,
  build: {
    outDir: `${out}/components`,
    emptyOutDir: false,
    minify: true,
    lib: {
      entry: `${here}src/examples.ts`,
      formats: ['iife'],
      name: 'QuietExamples',
      fileName: () => 'examples.js',
      cssFileName: 'examples',
    },
    rollupOptions: {
      external: ['vue', '@frederikhd/quiet'],
      output: { globals: { vue: 'Quiet.__vue', '@frederikhd/quiet': 'Quiet.__lib' } },
    },
  },
});

writeFileSync(`${out}/components/examples.js`, ascii(read(`${out}/components/examples.js`)));

// 3. components/index.d.ts: each component's props, as the canvas takes them.
writeFileSync(`${out}/components/index.d.ts`, indexDts(`${lib}/dist/types`));

// 4. Per component: the library's guidelines and a preview of its first explorer examples.
const title = (file) => {
  const words = file
    .replace(/\.vue$/, '')
    .replace(/^\d+-/, '')
    .replace(/([a-z])([A-Z])/g, '$1 $2');
  return words.charAt(0).toUpperCase() + words.slice(1).toLowerCase();
};
const preview = (name, group, subtitle) => `<!-- @dsCard group="${group}" height=480 subtitle="${subtitle}" -->
<!doctype html>
<html>
<head>
<meta charset="utf-8">
<title>${name} — preview</title>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="../../components/examples.css">
<style>
  body { margin: 0; }
  .qx { padding: var(--space-4); display: grid; grid-template-columns: minmax(0, 1fr); gap: var(--space-8); color: var(--ink); font-family: "Inter", system-ui, sans-serif; font-size: 15px; line-height: 22px; }
  .qx__title { margin: 0; font-size: 13px; line-height: 16px; font-weight: 500; color: var(--ink-muted); }
  .qx__desc { margin: 4px 0 0; font-size: 13px; line-height: 18px; color: var(--ink-muted); max-width: 72ch; }
  .qx__stage { margin-top: var(--space-3); }
</style>
</head>
<body>
<div id="root"></div>
<script>
  // The component's first examples from the explorer, on the components in bundle.js.
  (function () {
    var s = document.createElement('script');
    s.src = '../../components/examples.js';
    s.onload = function () { QuietExamples.mount(document.getElementById('root'), '${name}'); };
    document.head.appendChild(s);
  })();
</script>
</body>
</html>
`;
for (const [name, group] of Object.entries(groups)) {
  const dir = `${out}/components/${name}`;
  mkdirSync(dir, { recursive: true });
  cpSync(`${lib}/src/components/${name}/README.md`, `${dir}/README.md`);
  const files = existsSync(`${examplesDir}/${name}`) ? readdirSync(`${examplesDir}/${name}`).sort().slice(0, 3) : [];
  if (files.length) writeFileSync(`${dir}/preview.html`, preview(name, group, files.map(title).join(', ')));
}

// 5. The cover: the name and the package's description on the brand colours.
mkdirSync(`${out}/components/Cover`, { recursive: true });
writeFileSync(
  `${out}/components/Cover/preview.html`,
  `<!-- @dsCard height=288 -->
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap" rel="stylesheet">
<style>
  html, body { margin: 0; background: var(--surface); }
  .cover { position: relative; width: 960px; height: 288px; overflow: hidden; background: var(--surface); font-family: "Inter", system-ui, sans-serif; }
  .slab { position: absolute; top: 0; right: 0; width: 256px; height: 288px; background: var(--brand); }
  .tint { position: absolute; top: 32px; right: 288px; width: 160px; height: 128px; border-radius: var(--radius-lg); background: var(--brand-tint); }
  .ink { position: absolute; top: 192px; right: 352px; width: 96px; height: 64px; border-radius: var(--radius-md); background: var(--ink); }
  .text { position: absolute; left: 48px; bottom: 40px; max-width: 440px; }
  .name { margin: 0; font-size: 120px; line-height: .92; font-weight: 600; letter-spacing: -0.03em; color: var(--ink); }
  .tag { margin: 16px 0 0; font-size: 14px; line-height: 20px; color: var(--ink-muted); }
</style>
<div class="cover">
  <div class="slab"></div><div class="tint"></div><div class="ink"></div>
  <div class="text"><h1 class="name">Quiet</h1><p class="tag">${pkg.description.split(' — ').pop()}</p></div>
</div>
`,
);

// 6. The brand book: the library's README, then how the components work on a canvas; the guides as sections.
const canvas = `

## On a design canvas

These are the library's own Vue components (\`@frederikhd/quiet\` ${pkg.version}, ${branch}@${sha}), each wrapped as a React component in \`window.Quiet\`, so a canvas mounts them with \`<x-import component-from-global-scope="Quiet.Button">\`. Each takes:

- **Its props as the library names them**, in camelCase: \`labelHidden\`, \`iconStart="plus"\`, \`fullWidth\`.
- **Its value:** \`value\` + \`onChange\` (controlled; \`onChange\` gets the value), or \`defaultValue\` and let it keep its own (\`defaultChecked\` for a checkbox). Other models the same way: \`defaultOpen\` / \`onOpenChange\`, \`defaultPage\` / \`onPageChange\`.
- **Slots as props holding content:** \`children\` is the default slot; a named slot is a prop of that name (Page \`actions\`, AppShell \`nav\`, Input \`suffix\`).
- **Scoped slots as render props:** a function that gets the slot's props — Table \`'cell-status': ({ row }) => …\`, \`rowActions: ({ row }) => …\`, \`bulkActions: ({ selected }) => …\`.
- **Events as \`on\` + their name:** \`onClear\`, \`onRemove\`, \`onSelect\`, \`onClick\`.
- **Nesting:** Quiet components inside each other (Field › Input, RadioGroup › Radio, Form › Field) join one Vue tree, so labels, ids, errors and groups connect.
- \`configure({ locale: 'de-DE', currency: 'EUR' })\` on \`window.Quiet\` sets the shop's language and currency.

Each component's guidelines are its README in the library, and its preview runs its first examples from the explorer.
`;
writeFileSync(`${out}/README.md`, read(`${lib}/README.md`).trimEnd() + canvas);
const guides = [...read(`${root}packages/quiet-explorer/src/guides/index.ts`).matchAll(/slug: '([a-z-]+)'/g)].map(
  (m) => m[1],
);
mkdirSync(`${out}/guides`, { recursive: true });
guides.forEach((slug, i) => cpSync(`${lib}/docs/guides/${slug}.md`, `${out}/guides/${i + 1}-${slug}.md`));

// 7. The tokens, with where they came from.
const tokens = JSON.parse(read(`${lib}/src/tokens/tokens.json`));
tokens.meta = {
  source: 'github',
  repo: 'FrederikHD/Quiet',
  ref: `${branch}@${sha}`,
  package: 'packages/quiet',
  version: pkg.version,
  paths: {
    tokens: ['packages/quiet/src/tokens/tokens.json'],
    docs: ['packages/quiet/README.md', 'packages/quiet/docs/guides', 'packages/quiet/src/components/*/README.md'],
    previews: ['packages/quiet-explorer/src/examples'],
  },
  synced: new Date().toISOString().slice(0, 10),
};
writeFileSync(`${out}/tokens.json`, `${JSON.stringify(tokens, null, 2)}\n`);

const count = (dir) => readdirSync(dir, { recursive: true }).filter((f) => /\.\w+$/.test(f)).length;
console.log(
  `✓ Design system for ${pkg.version} (${branch}@${sha}): ${exported.length} components, ${count(out)} files in ${out}`,
);
