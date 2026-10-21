// Only /en/… and /de/… exist: anything else is a 404.
import { langs, type Lang } from '~/locales/messages';

export default defineNuxtRouteMiddleware((to) => {
  if (to.path === '/') return;
  if (!langs.includes(to.params.lang as Lang)) throw createError({ statusCode: 404, statusMessage: 'Not found' });
});
