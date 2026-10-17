import { createRouter, createWebHistory } from 'vue-router';
import { entries } from './catalog';

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: () => import('./pages/HomePage.vue'), meta: { title: 'Brand book' } },
    { path: '/foundations/tokens', name: 'tokens', component: () => import('./pages/TokensPage.vue'), meta: { title: 'Tokens' } },
    { path: '/foundations/icons', name: 'icons', component: () => import('./pages/IconsPage.vue'), meta: { title: 'Icons' } },
    {
      path: '/components/:slug/:tab?',
      name: 'component',
      component: () => import('./pages/ComponentPage.vue'),
      props: true,
      beforeEnter: (to) => (entries.some((e) => e.slug === to.params.slug) ? true : { name: 'not-found' }),
    },
    { path: '/:rest(.*)*', name: 'not-found', component: () => import('./pages/NotFoundPage.vue'), meta: { title: 'Not found' } },
  ],
  // Example links (#button-sizes) scroll to the card, clear of the sticky phone header.
  scrollBehavior: (to, _from, saved) => saved ?? (to.hash ? { el: to.hash, top: 72, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' } : { top: 0 }),
});

router.afterEach((to) => {
  const entry = entries.find((e) => e.slug === to.params.slug);
  document.title = `${entry?.title ?? (to.meta.title as string | undefined) ?? 'Explorer'} · Quiet`;
});
