import {
  createPlugin,
  createRoutableExtension,
} from '@backstage/core-plugin-api';

import { rootRouteRef } from './routes';

export const convoFrontendPlugin = createPlugin({
  id: 'convo-frontend',
  routes: {
    root: rootRouteRef,
  },
});

export const ConvoFrontendPage = convoFrontendPlugin.provide(
  createRoutableExtension({
    name: 'ConvoFrontendPage',
    component: () =>
      import('./components/Convo').then(m => m.Convo),
    mountPoint: rootRouteRef,
  }),
);
