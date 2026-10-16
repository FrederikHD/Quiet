// Quiet — Vue 3 components for commerce storefronts and back offices.
//
//   import { createApp } from 'vue';
//   import { Quiet } from 'quiet';
//   import 'quiet/style.css';
//   createApp(App).use(Quiet, { locale: 'de-DE' }).mount('#app');
//
// Or import components one by one: import { QButton, QField, QInput } from 'quiet';

import './styles/index.css';

export { configure, useConfig, money, fmt, currencySymbol, type ConfigureOptions, type QuietConfig } from './config';
export { useStickyPad } from './composables/useStickyPad';
export { Quiet, type QuietPluginOptions } from './plugin';

export * from './components';
