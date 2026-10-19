import { configure } from '@frederikhd/quiet';
import { createApp } from 'vue';
import App from './App.vue';
import { router } from './router';
import './fonts.css';
import './explorer.css';

// The design system's shop sells in euros to German-speaking customers: numbers and money as in de-DE.
// configure() rather than the Quiet plugin: every page imports the components it uses, so each page's chunk carries
// only those, instead of all of them registered globally up front.
configure({ locale: 'de-DE', currency: 'EUR' });
createApp(App).use(router).mount('#app');
