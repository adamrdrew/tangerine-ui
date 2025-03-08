import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useApi, configApiRef } from '@backstage/core-plugin-api';

import {
  ChatbotHeader,
  ChatbotHeaderMain,
  ChatbotHeaderActions,
  ChatbotHeaderTitle,
} from '@patternfly/chatbot/dist/dynamic/ChatbotHeader';

import { Title, Button } from '@patternfly/react-core';

import { AgentSelect } from './AgentSelect';

import { customStyles } from '../../lib/styles';
import { useTheme } from '@material-ui/core/styles';

export const ConvoHeader: React.FC<{
  onAgentSelect: (agent: any) => void;
  onNewChatClick: ([]: any) => void;
  agents: any[];
  selectedAgent: any;
  loading: boolean;
}> = ({ onAgentSelect, onNewChatClick, agents, selectedAgent, loading }) => {
  // CSS Overrides to make PF components look normal in Backstage
  const theme = useTheme();
  const config = useApi(configApiRef);
  const highlightColor =
    config.getString('convoFrontend.highlightColor')
    const title = config.getString('convoFrontend.title');
  const useStyles = makeStyles(_theme => customStyles(theme, highlightColor));
  const classes = useStyles();
  return (
    <ChatbotHeader className={classes.header}>
      <ChatbotHeaderMain>
        <ChatbotHeaderTitle className={classes.headerTitle}>
          <Title headingLevel="h1" size="3xl">
            {title}
          </Title>
        </ChatbotHeaderTitle>
      </ChatbotHeaderMain>
      <ChatbotHeaderActions>
        <Button
          className={
            loading ? classes.redHatGrayBGColor : classes.redHatRedBGColor
          }
          isDisabled={loading}
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
          className={classes.agentMenu}
        />
      </ChatbotHeaderActions>
    </ChatbotHeader>
  );
};
