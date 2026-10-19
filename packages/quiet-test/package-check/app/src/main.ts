import { Quiet } from '@frederikhd/quiet';
import '@frederikhd/quiet/style.css';
import { createApp } from 'vue';
import App from './App.vue';

createApp(App).use(Quiet, { locale: 'de-DE', currency: 'EUR' }).mount('#app');
