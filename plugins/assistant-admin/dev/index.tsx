import React from 'react';
import { createDevApp } from '@backstage/dev-utils';
import { assistantAdminPlugin, AssistantAdminPage } from '../src/plugin';

createDevApp()
  .registerPlugin(assistantAdminPlugin)
  .addPage({
    element: <AssistantAdminPage />,
    title: 'Root Page',
    path: '/assistant-admin',
  })
  .render();
