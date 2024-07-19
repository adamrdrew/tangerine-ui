import React from 'react';
import { createDevApp } from '@backstage/dev-utils';
import { chatBotFrontendPlugin, ChatBotFrontendPage } from '../src/plugin';

createDevApp()
  .registerPlugin(chatBotFrontendPlugin)
  .addPage({
    element: <ChatBotFrontendPage />,
    title: 'Root Page',
    path: '/chat-bot-frontend',
  })
  .render();
