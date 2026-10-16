<script setup lang="ts">
// Every token, read from quiet/src/tokens/tokens.json — the same file tokens.css is generated from.
import tokens from '@quiet/src/tokens/tokens.json';
import { QCard, QPage, QTable } from 'quiet';

interface Tok {
  name: string;
  value: string | Record<string, string>;
  usage?: string;
}
const themes = tokens.color.themes;
const colours = tokens.color.tokens as Tok[];
const valueIn = (t: Tok, theme: string) => (typeof t.value === 'string' ? t.value : t.value[theme]);
const families = Object.entries(tokens).filter(
  ([k, v]) => !['name', 'version', 'color', 'type'].includes(k) && v && typeof v === 'object' && 'tokens' in v,
) as [string, { tokens: Tok[]; note?: string }][];
const fontStack = (family: string) => (tokens.type.families as Record<string, string>)[family];
</script>

<template>
  <QPage title="Tokens" subtitle="Generated into tokens.css as CSS custom properties: var(--brand), var(--space-4), var(--text-body) …">
    <QCard title="Colour" :heading-level="2" flush>
      <QTable
        caption="Colour tokens"
        caption-hidden
        :columns="[
          { key: 'name', header: 'Token' },
          ...themes.map((t) => ({ key: t.id, header: t.name })),
          { key: 'usage', header: 'Usage', wrap: true },
        ]"
        :rows="colours"
        row-key="name"
      >
        <template #cell-name="{ row }"><code>--{{ row.name }}</code></template>
        <template v-for="t in themes" :key="t.id" #[`cell-${t.id}`]="{ row }">
          <span class="ex-swatch">
            <span class="ex-swatch__chip" :style="{ background: valueIn(row, t.id) }" />
            <code>{{ valueIn(row, t.id) }}</code>
          </span>
        </template>
      </QTable>
    </QCard>

    <QCard title="Type" :heading-level="2">
      <p class="ex-muted">Font: <code>{{ fontStack('sans') }}</code>. Use the shorthand <code>font: var(--text-body)</code> or the class <code>.q-text-body</code>.</p>
      <div v-for="g in tokens.type.groups" :key="g.name" class="ex-type-group">
        <h3 class="ex-h3">{{ g.name }}</h3>
        <div v-for="s in g.styles" :key="s.name" class="ex-type-row">
          <code>{{ s.name }}</code>
          <span class="ex-type-meta">{{ s.fontSize }}/{{ s.lineHeight }} · {{ s.fontWeight }}</span>
          <span :style="{ font: `${s.fontWeight} ${s.fontSize}/${s.lineHeight} ${fontStack(g.family)}` }">Linen shirt, navy — 59,00 €</span>
        </div>
      </div>
    </QCard>

    <QCard v-for="[family, def] in families" :key="family" :title="family.charAt(0).toUpperCase() + family.slice(1)" :heading-level="2" :description="def.note">
      <div v-for="t in def.tokens" :key="t.name" class="ex-scale-row">
        <code>--{{ t.name }}</code>
        <span class="ex-type-meta">{{ t.value }}</span>
        <span v-if="family === 'radius'" class="ex-radius" :style="{ borderRadius: String(t.value) }" />
        <span v-else-if="family === 'spacing' || family === 'size'" class="ex-bar" :style="{ width: String(t.value) }" />
        <span class="ex-muted">{{ t.usage }}</span>
      </div>
    </QCard>
  </QPage>
</template>
