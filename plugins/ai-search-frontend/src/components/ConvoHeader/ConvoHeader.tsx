import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

import {
  ChatbotHeader,
  ChatbotHeaderMain,
  ChatbotHeaderActions,
  ChatbotHeaderTitle,
} from '@patternfly/chatbot/dist/dynamic/ChatbotHeader';

import { Title, Button } from '@patternfly/react-core';

import { AgentSelect } from './AgentSelect';

// CSS Overrides to make PF components look normal in Backstage
const useStyles = makeStyles(_theme => ({
  headerTitle: {
    justifyContent: 'left !important',
  },
}));

export const ConvoHeader: React.FC<{
  onAgentSelect: (agent: any) => void;
  onNewChatClick: ([]: any) => void;
  agents: any[];
  selectedAgent: any;
}> = ({ onAgentSelect, onNewChatClick, agents, selectedAgent }) => {
  const classes = useStyles();

  return (
    <ChatbotHeader>
      <ChatbotHeaderMain>
        <ChatbotHeaderTitle className={classes.headerTitle}>
          <Title headingLevel="h1" size="3xl">
            Convo
          </Title>
        </ChatbotHeaderTitle>
      </ChatbotHeaderMain>
      <ChatbotHeaderActions>
        <Button
          onClick={() => {
            onNewChatClick([]);
          }}
        >
          New Chat
        </Button>
        <AgentSelect
          agents={agents}
          onAgentSelect={onAgentSelect}
          selectedAgent={selectedAgent}
        />
      </ChatbotHeaderActions>
    </ChatbotHeader>
  );
};
