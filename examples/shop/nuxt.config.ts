// A shop as an app would build it: Nuxt with server rendering, @frederikhd/quiet from npm, English and German.
// `npm run generate` prerenders every page to static HTML (GitHub Pages serves it under /Quiet/example/).
export default defineNuxtConfig({
  compatibilityDate: '2026-10-01',
  css: ['@frederikhd/quiet/style.css', '~/assets/shop.css'],
  app: {
    baseURL: process.env.NUXT_APP_BASE_URL ?? '/',
    head: {
      htmlAttrs: { 'data-density': 'comfortable' },
      meta: [{ name: 'viewport', content: 'width=device-width, initial-scale=1' }],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap' },
      ],
      // The theme follows the system. Set before the first paint, so a dark page never flashes light.
      script: [
        {
          innerHTML:
            "document.documentElement.setAttribute('data-theme', matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')",
        },
      ],
    },
  },
  nitro: { prerender: { crawlLinks: true, routes: ['/', '/en', '/de', '/en/checkout', '/de/checkout'] } },
});
