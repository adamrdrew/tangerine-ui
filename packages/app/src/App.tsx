import React from 'react';
import { Route } from 'react-router-dom';

import { apis } from './apis';
import { Root } from './components/Root';

import { createApp } from '@backstage/app-defaults';
import { AppRouter, FlatRoutes } from '@backstage/core-app-api';
import { ConvoFrontendPage } from '@redhatinsights/backstage-plugin-convo-frontend';

const app = createApp({
  apis,
});

const routes = (
  <FlatRoutes>
    <Route path="/" element={<ConvoFrontendPage />} />
    <Route path="/convo" element={<ConvoFrontendPage />} />
  </FlatRoutes>
);

export default app.createRoot(
  <>
    <AppRouter>
      <Root>{routes}</Root>
    </AppRouter>
  </>,
);
