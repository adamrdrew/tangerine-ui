import {
  createPlugin,
  createRoutableExtension,
} from '@backstage/core-plugin-api';

import { rootRouteRef } from './routes';

export const aiSearchFrontendPlugin = createPlugin({
  id: 'ai-search-frontend',
  routes: {
    root: rootRouteRef,
  },
});

export const AISearchFrontendPage = aiSearchFrontendPlugin.provide(
  createRoutableExtension({
    name: 'AISearchFrontendPage',
    component: () =>
      import('./components/AISearchComponent').then(m => m.AISearchComponent),
    mountPoint: rootRouteRef,
  }),
);
