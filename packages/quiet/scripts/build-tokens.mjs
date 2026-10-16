// Generates src/styles/tokens.css from src/tokens/tokens.json — the one source of truth for colours, type,
// spacing, radius and sizes. Run with `npm run tokens` (the build runs it too). The output is committed, so the
// explorer and the tests work without a build; quiet-test checks that it is in sync.
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const root = new URL('../', import.meta.url);
const tokens = JSON.parse(readFileSync(new URL('src/tokens/tokens.json', root), 'utf8'));
const out = fileURLToPath(new URL('src/styles/tokens.css', root));

export function buildTokensCss(t) {
  const lines = [`/* ${t.name} — generated from tokens.json by scripts/build-tokens.mjs. Do not edit. */`];
  const themes = t.color.themes.map((th) => th.id);
  const [first, ...others] = themes;
  const valueIn = (token, theme) => {
    const v = typeof token.value === 'string' ? (theme === first ? token.value : undefined) : token.value[theme];
    return v === undefined ? undefined : String(v).toLowerCase().startsWith('#') ? String(v).toLowerCase() : String(v);
  };
  const comment = (s) => (s ? ` /* ${s.replace(/\*\//g, '* /')} */` : '');

  // Colours: the first theme on :root, the others under [data-theme].
  lines.push(`:root, [data-theme="${first}"] {`);
  for (const tok of t.color.tokens) lines.push(`  --${tok.name}: ${valueIn(tok, first)};${comment(tok.usage)}`);
  lines.push('}');
  for (const theme of others) {
    lines.push(`[data-theme="${theme}"] {`);
    for (const tok of t.color.tokens) {
      const v = valueIn(tok, theme);
      if (v !== undefined) lines.push(`  --${tok.name}: ${v};`);
    }
    lines.push('}');
  }

  // Every other family: one flat list of custom properties.
  lines.push(':root {');
  for (const [family, def] of Object.entries(t)) {
    if (['name', 'version', 'color', 'type'].includes(family) || !def || !Array.isArray(def.tokens)) continue;
    for (const tok of def.tokens) lines.push(`  --${tok.name}: ${tok.value};${comment(tok.usage)}`);
  }
  for (const [name, stack] of Object.entries(t.type.families)) lines.push(`  --font-${name}: ${stack};`);
  for (const group of t.type.groups) {
    for (const s of group.styles) {
      lines.push(`  --text-${s.name}: ${s.fontWeight} ${s.fontSize}/${s.lineHeight} var(--font-${group.family});`);
    }
  }
  lines.push('}');

  // Text style classes: .q-text-body, .q-text-price …
  for (const group of t.type.groups) {
    for (const s of group.styles) {
      lines.push(
        `.q-text-${s.name} { font-family: var(--font-${group.family}); font-size: ${s.fontSize}; line-height: ${s.lineHeight}; font-weight: ${s.fontWeight}; }`,
      );
    }
  }

  // Paper is white: print always uses the first theme's colours, whatever the screen theme.
  lines.push('@media print {');
  lines.push('  :root, [data-theme] {');
  for (const tok of t.color.tokens) lines.push(`    --${tok.name}: ${valueIn(tok, first)} !important;`);
  lines.push(`    color-scheme: ${first};`);
  lines.push('  }');
  lines.push('}');
  return lines.join('\n') + '\n';
}

const css = buildTokensCss(tokens);
if (process.argv.includes('--check')) {
  const current = readFileSync(out, 'utf8');
  if (current !== css) {
    console.error('tokens.css is out of date — run `npm run tokens`.');
    process.exit(1);
  }
  console.log('tokens.css is up to date.');
} else {
  writeFileSync(out, css);
  console.log(`Wrote ${out}`);
}
