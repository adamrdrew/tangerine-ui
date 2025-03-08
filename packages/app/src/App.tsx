import React from 'react';
import { Route } from 'react-router-dom';
import {
  CatalogEntityPage,
} from '@backstage/plugin-catalog';

import { UserSettingsPage } from '@backstage/plugin-user-settings';
import { apis } from './apis';
import { entityPage } from './components/catalog/EntityPage';
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
    <Route
      path="/catalog/:namespace/:kind/:name"
      element={<CatalogEntityPage />}
    >
      {entityPage}
    </Route>



    <Route path="/settings" element={<UserSettingsPage />} />
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
