import {
  createPlugin,
  createRoutableExtension,
} from '@backstage/core-plugin-api';

import { rootRouteRef } from './routes';

export const chatBotFrontendPlugin = createPlugin({
  id: 'chat-bot-frontend',
  routes: {
    root: rootRouteRef,
  },
});

export const ChatBotFrontendPage = chatBotFrontendPlugin.provide(
  createRoutableExtension({
    name: 'ChatBotFrontendPage',
    component: () =>
      import('./components/ExampleComponent').then(m => m.ExampleComponent),
    mountPoint: rootRouteRef,
  }),
);
