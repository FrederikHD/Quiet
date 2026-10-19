<script setup lang="ts">
import brandBook from '@quiet/docs/brand-book.md?raw';
import { QCard, QPage } from '@frederikhd/quiet';
import { groups } from '../catalog';
import MarkdownView from './MarkdownView.vue';
</script>

<template>
  <QPage title="Quiet" subtitle="A calm, neutral-first design system for commerce — in Vue.">
    <QCard title="Get started" :heading-level="2">
      <ol class="ex-steps">
        <li>
          Add the <code>quiet</code> package — it isn't on npm yet; in this repo it is the
          <code>packages/quiet</code> workspace.
        </li>
        <li>
          <code>import '@frederikhd/quiet/style.css'</code> and <code>app.use(Quiet, { locale: 'de-DE' })</code> — or
          import components one by one: <code>import { QButton } from '@frederikhd/quiet'</code>.
        </li>
        <li>
          Load Inter from Google Fonts, set <code>data-theme</code> and <code>data-density</code> on
          <code>&lt;html&gt;</code>.
        </li>
      </ol>
      <p class="ex-muted">
        {{ groups.reduce((n, g) => n + g.entries.length, 0) }} components in {{ groups.length }} groups. Pick one from
        the navigation.
      </p>
    </QCard>
    <MarkdownView :source="brandBook" />
  </QPage>
</template>
