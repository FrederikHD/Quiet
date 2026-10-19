import { Quiet } from '@frederikhd/quiet';
import { createApp } from 'vue';
import App from './App.vue';
import { router } from './router';
import './fonts.css';
import './explorer.css';

// The design system's shop sells in euros to German-speaking customers: numbers and money as in de-DE.
createApp(App).use(router).use(Quiet, { locale: 'de-DE', currency: 'EUR' }).mount('#app');
