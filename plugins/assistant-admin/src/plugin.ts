import {
  createPlugin,
  createRoutableExtension,
} from '@backstage/core-plugin-api';

import { rootRouteRef } from './routes';

export const assistantAdminPlugin = createPlugin({
  id: 'assistant-admin',
  routes: {
    root: rootRouteRef,
  },
});

export const AssistantAdminPage = assistantAdminPlugin.provide(
  createRoutableExtension({
    name: 'AssistantAdminPage',
    component: () =>
      import('./components/ExampleComponent').then(m => m.ExampleComponent),
    mountPoint: rootRouteRef,
  }),
);
