// The current language (from the URL), the shop's words in it, and links that stay in it.
import { messagesFor, type Lang } from '~/locales/messages';

export function useShop() {
  const route = useRoute();
  const base = useRuntimeConfig().app.baseURL.replace(/\/$/, '');
  const lang = computed<Lang>(() => (route.params.lang === 'de' ? 'de' : 'en'));
  const t = computed(() => messagesFor(lang.value));
  /** A route in this language, for NuxtLink and navigateTo: "/de/cart". */
  const path = (to = '') => `/${lang.value}${to}`;
  /** The same as an address, for Quiet's links (href), which the router doesn't rewrite: "/Quiet/example/de/cart". */
  const href = (to = '') => `${base}${path(to)}`;
  return { lang, t, path, href };
}
