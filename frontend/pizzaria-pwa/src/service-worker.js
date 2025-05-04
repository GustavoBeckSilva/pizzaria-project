/* eslint-disable no-restricted-globals */
import { clientsClaim } from 'workbox-core';
import {
  precacheAndRoute,
  cleanupOutdatedCaches,
  matchPrecache
} from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { StaleWhileRevalidate } from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';

clientsClaim();

// 1) Precache: inclui o manifest injetado E o offline.html
precacheAndRoute([
  ...(self.__WB_MANIFEST || []),
  { url: '/offline.html', revision: '1' }
]);

cleanupOutdatedCaches();

// 2) Handler de navegação com fallback
registerRoute(
  ({ request }) => request.mode === 'navigate',
  async ({ request }) => {
    try {
      const response = await fetch(request);
      if (response.redirected) {
        return matchPrecache('/offline.html');
      }
      return response;
    } catch {
      return matchPrecache('/offline.html');
    }
  }
);

// 3) Cache dinâmico para API de menu
registerRoute(
  ({ url }) =>
    url.pathname.startsWith('/api/tamanhos') ||
    url.pathname.startsWith('/api/sabores'),
  new StaleWhileRevalidate({
    cacheName: 'api-menu-cache',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 20,
        maxAgeSeconds: 24 * 60 * 60, // 1 dia
      }),
    ],
  })
);
