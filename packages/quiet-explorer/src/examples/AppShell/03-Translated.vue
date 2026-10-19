<!-- strings translates the menu button, the skip link and the drawer's close button; the Nav's landmark name comes from the same place. -->
<script setup lang="ts">
import { QAppShell, QNav, QPage } from '@frederikhd/quiet';
</script>

<template>
  <div class="box">
    <QAppShell
      brand="Leinen & Co"
      contained
      :toaster="false"
      :strings="{ menu: 'Menü', skip: 'Zum Inhalt springen', closeMenu: 'Menü schließen', nav: 'Hauptmenü' }"
    >
      <template #nav>
        <QNav
          :items="[
            { label: 'Bestellungen', href: '#bestellungen', icon: 'bag', current: true },
            { label: 'Produkte', href: '#produkte', icon: 'package' },
            { label: 'Kunden', href: '#kunden', icon: 'user' },
          ]"
          :strings="{ nav: 'Hauptmenü' }"
        />
      </template>
      <QPage title="Bestellungen" subtitle="38 heute" />
    </QAppShell>
  </div>
</template>

<style scoped>
.box { height: 360px; border: 1px solid var(--line); border-radius: var(--radius-md); overflow: hidden; }
</style>
