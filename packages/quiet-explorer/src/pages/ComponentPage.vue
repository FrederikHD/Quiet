<script setup lang="ts">
import { QBadge, QPage, QTable, QTabs, type TabItem } from '@frederikhd/quiet';
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { entries } from '../catalog';
import PlaygroundView from '../playground/PlaygroundView.vue';
import CodeBlock from './CodeBlock.vue';
import ExampleView from './ExampleView.vue';
import MarkdownView from './MarkdownView.vue';

const props = defineProps<{ slug: string; tab?: string }>();
const router = useRouter();

const entry = computed(() => entries.find((e) => e.slug === props.slug)!);
const tabs = computed(() =>
  [
    { value: 'docs', label: 'Guidelines' },
    entry.value.story && { value: 'playground', label: 'Playground' },
    { value: 'api', label: 'API' },
    { value: 'examples', label: 'Examples', count: entry.value.examples.length || undefined },
  ]
    .filter((t): t is { value: string; label: string; count?: number } => !!t)
    .map((t) => {
      const path = `/components/${props.slug}${t.value === 'docs' ? '' : `/${t.value}`}`;
      return { ...t, path, href: router.resolve(path).href };
    }),
);
const current = computed(() => (tabs.value.some((t) => t.value === props.tab) ? props.tab! : 'docs'));
// Link tabs: each is a real URL (bookmarkable, opens in a new tab); a plain click routes on the client.
function go(tab: TabItem, e: MouseEvent) {
  const path = (tab as TabItem & { path?: string }).path;
  if (e.metaKey || e.ctrlKey || e.shiftKey || !path) return;
  e.preventDefault();
  void router.push(path);
}
const usage = computed(() => `import { ${entry.value.apis.map((a) => a.name).join(', ')} } from '@frederikhd/quiet';`);
</script>

<template>
  <QPage :title="entry.title" :subtitle="entry.summary">
    <template #title-meta
      ><QBadge>{{ entry.group }}</QBadge></template
    >
    <QTabs :model-value="current" :label="`${entry.title} documentation`" :tabs="tabs" @navigate="go">
      <div v-if="current === 'docs'" class="ex-stack">
        <ExampleView v-if="entry.examples[0]" :example="entry.examples[0]" />
        <CodeBlock :code="usage" lang="ts" />
        <MarkdownView :source="entry.readme" />
      </div>

      <PlaygroundView v-else-if="current === 'playground' && entry.story" :entry="entry" />

      <div v-else-if="current === 'api'" class="ex-stack" data-testid="api">
        <section v-for="api in entry.apis" :key="api.name" class="ex-api" :aria-labelledby="`api-${api.name}`">
          <header>
            <h2 :id="`api-${api.name}`" class="ex-h2">{{ api.name }}</h2>
            <p class="ex-muted">{{ api.file }}</p>
          </header>
          <QTable
            :caption="`${api.name} props`"
            :columns="[
              { key: 'name', header: 'Prop' },
              { key: 'type', header: 'Type', wrap: true },
              { key: 'default', header: 'Default' },
              { key: 'description', header: 'Description', wrap: true },
            ]"
            :rows="api.props"
            row-key="name"
            mobile="cards"
            density="compact"
          >
            <template #cell-name="{ row }"
              ><code>{{ row.name }}</code
              ><span v-if="row.required" class="ex-required"> required</span></template
            >
            <template #cell-type="{ row }"
              ><code class="ex-type">{{ row.type }}</code></template
            >
            <template #cell-default="{ row }"
              ><code v-if="row.default">{{ row.default }}</code></template
            >
            <template #empty>No props.</template>
          </QTable>
          <QTable
            v-if="api.events.length"
            :caption="`${api.name} events`"
            :columns="[
              { key: 'name', header: 'Event' },
              { key: 'type', header: 'Payload', wrap: true },
              { key: 'description', header: 'Description', wrap: true },
            ]"
            :rows="api.events"
            row-key="name"
            mobile="cards"
            density="compact"
          >
            <template #cell-name="{ row }"
              ><code>@{{ row.name }}</code></template
            >
            <template #cell-type="{ row }"
              ><code class="ex-type">{{ row.type }}</code></template
            >
          </QTable>
          <QTable
            v-if="api.slots.length"
            :caption="`${api.name} slots`"
            :columns="[
              { key: 'name', header: 'Slot' },
              { key: 'type', header: 'Slot props', wrap: true },
              { key: 'description', header: 'Description', wrap: true },
            ]"
            :rows="api.slots"
            row-key="name"
            mobile="cards"
            density="compact"
          >
            <template #cell-name="{ row }"
              ><code>#{{ row.name }}</code></template
            >
            <template #cell-type="{ row }"
              ><code class="ex-type">{{ row.type === '{}' ? '' : row.type }}</code></template
            >
          </QTable>
          <QTable
            v-if="api.exposed.length"
            :caption="`${api.name} ref (exposed)`"
            :columns="[
              { key: 'name', header: 'Name' },
              { key: 'type', header: 'Type', wrap: true },
            ]"
            :rows="api.exposed"
            row-key="name"
            mobile="cards"
            density="compact"
          >
            <template #cell-name="{ row }"
              ><code>{{ row.name }}</code></template
            >
            <template #cell-type="{ row }"
              ><code class="ex-type">{{ row.type }}</code></template
            >
          </QTable>
        </section>
      </div>

      <div v-else class="ex-stack">
        <nav v-if="entry.examples.length > 2" class="ex-toc" aria-label="Examples on this page">
          <RouterLink v-for="ex in entry.examples" :key="ex.id" :to="{ hash: `#${ex.id}` }" class="ex-toc__link">{{
            ex.title
          }}</RouterLink>
        </nav>
        <ExampleView v-for="ex in entry.examples" :key="ex.id" :example="ex" />
        <p v-if="!entry.examples.length" class="ex-muted">No examples yet.</p>
      </div>
    </QTabs>
  </QPage>
</template>
