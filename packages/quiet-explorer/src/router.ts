import { createRouter, createWebHistory, type RouteLocationNormalized } from 'vue-router';
import { entries, loadDetails } from './catalog';
import { patterns } from './patterns';

// An unknown component, tab or pattern shows the not-found page at the address that was asked for (the URL stays).
const notFound = (to: RouteLocationNormalized) => ({
  name: 'not-found',
  params: { rest: to.path.slice(1).split('/') },
  query: to.query,
  hash: to.hash,
});
const tabs = ['api', 'examples', 'playground'];

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: () => import('./pages/HomePage.vue'), meta: { title: 'Brand book' } },
    {
      path: '/foundations/tokens',
      name: 'tokens',
      component: () => import('./pages/TokensPage.vue'),
      meta: { title: 'Tokens' },
    },
    {
      path: '/foundations/icons',
      name: 'icons',
      component: () => import('./pages/IconsPage.vue'),
      meta: { title: 'Icons' },
    },
    {
      path: '/components/:slug/:tab?',
      name: 'component',
      component: () => import('./pages/ComponentPage.vue'),
      props: true,
      beforeEnter: (to) => {
        const entry = entries.find((e) => e.slug === to.params.slug);
        const tab = to.params.tab as string | undefined;
        if (!entry || (tab && (!tabs.includes(tab) || (tab === 'playground' && !entry.hasStory)))) return notFound(to);
        return true;
      },
    },
    {
      path: '/patterns/:slug',
      name: 'pattern',
      component: () => import('./pages/PatternPage.vue'),
      props: true,
      beforeEnter: (to) => (patterns.some((p) => p.slug === to.params.slug) ? true : notFound(to)),
    },
    {
      path: '/:rest(.*)*',
      name: 'not-found',
      component: () => import('./pages/NotFoundPage.vue'),
      meta: { title: 'Not found' },
    },
  ],
  // Example links (#button-sizes) scroll to the card, clear of the sticky phone header.
  // Other hashes (an example's own #orders link) stay where they are.
  scrollBehavior: (to, from, saved) => {
    if (saved) return saved;
    if (!to.hash) return { top: 0 };
    if (!document.getElementById(decodeURIComponent(to.hash.slice(1))))
      return to.path === from.path ? false : { top: 0 };
    return {
      el: to.hash,
      top: 72,
      behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
    };
  },
});

// A component page renders with its examples in place, so a link to one (#button-sizes) can scroll to it.
router.beforeResolve(async (to) => {
  const entry = to.name === 'component' ? entries.find((e) => e.slug === to.params.slug) : undefined;
  if (entry) await loadDetails(entry);
});

router.afterEach((to) => {
  const entry = entries.find((e) => e.slug === to.params.slug);
  const pattern = to.name === 'pattern' ? patterns.find((p) => p.slug === to.params.slug) : undefined;
  document.title = `${pattern?.title ?? entry?.title ?? (to.meta.title as string | undefined) ?? 'Explorer'} · Quiet`;
});
