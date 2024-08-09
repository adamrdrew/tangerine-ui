import React from 'react';
import { createDevApp } from '@backstage/dev-utils';
import { aiSearchFrontendPlugin, AISearchFrontendPage } from '../src/plugin';

createDevApp()
  .registerPlugin(aiSearchFrontendPlugin)
  .addPage({
    element: <AISearchFrontendPage />,
    title: 'Root Page',
    path: '/ai-search-frontend',
  })
  .render();
