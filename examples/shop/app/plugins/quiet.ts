// The language comes from the URL (/de/… is German), which the server and the browser both see, so a page hydrates in
// the language it was rendered in. On the server, each request's app keeps its own settings.
import { Quiet } from '@frederikhd/quiet';
import { de } from '~/locales/de';

export default defineNuxtPlugin((nuxtApp) => {
  const base = useRuntimeConfig().app.baseURL;
  const german = useRequestURL().pathname.slice(base.length).startsWith('de');
  nuxtApp.vueApp.use(Quiet, {
    locale: german ? 'de-DE' : 'en-GB',
    currency: 'EUR',
    strings: german ? de : {},
    components: false,
  });
});
