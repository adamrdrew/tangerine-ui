import React, { useEffect, useState } from 'react';
import { InfoCard } from '@backstage/core-components';

import VirtualAssistant from '@patternfly/virtual-assistant/dist/dynamic/VirtualAssistant';
import ConversationAlert from '@patternfly/virtual-assistant/dist/esm/ConversationAlert';
import { useApi, configApiRef } from '@backstage/core-plugin-api';
import AssistantMessageEntry from '@patternfly/virtual-assistant/dist/dynamic/AssistantMessageEntry';
import UserMessageEntry from '@patternfly/virtual-assistant/dist/dynamic/UserMessageEntry';
import LoadingMessage from '@patternfly/virtual-assistant/dist/esm/LoadingMessage';
import SystemMessageEntry from '@patternfly/virtual-assistant/dist/esm/SystemMessageEntry';

export const AISearchComponent = () => {
  const BOT = 'ai';
  const USER = 'human';

  const makeQuery = (query: string) => {
    return {
      query: query,
      stream: false,
      prvMsgs: conversation,
    };
  };

  // What is displayed in the user input text box
  const [userInputMessage, setUserInputMessage] = useState<string>('');
  const [conversation, setConversation] = useState([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const config = useApi(configApiRef);
  const backendUrl = config.getString('backend.baseUrl');

  const sendUserQuery = async (agentId: number, userQuery: any) => {
    setLoading(true);
    setError(false);

    if (userQuery !== '') {
      await fetch(
        `${backendUrl}/api/proxy/backend/api/agents/${agentId}/chat`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(makeQuery(userQuery)),
          cache: 'no-cache',
        },
      )
        .then(response => response.json())
        .then(response => {
          setLoading(false);
          addConversationEntry(response);
        })
        .catch(_error => {
          setLoading(false);
          setError(true);
          console.error(`Error fetching response from backend chat bot server`);
        });
    }
  };

  const SendMessageHandler = (msg: string) => {
    const conversationEntry = {
      text: msg,
      sender: USER,
    };
    setConversation([...conversation, conversationEntry]);
    sendUserQuery(1, msg);
    setUserInputMessage('');
  };

  const addConversationEntry = result => {
    const conversationEntry = {
      text: result.text_content,
      sender: BOT,
      search_metadata: result.search_metadata,
    };
    setConversation([...conversation, conversationEntry]);
  };

  const Conversation = () => {
    return conversation.map((entry, index) => {
      if (entry.sender === USER) {
        return <UserMessageEntry key={index}>{entry.text}</UserMessageEntry>;
      }
      if (entry.sender === BOT) {
        return (
          <AssistantMessageEntry key={index}>
            {entry.text}
          </AssistantMessageEntry>
        );
      }
      return null;
    });
  };

  const ShowLoadingMessage = () => {
    if (loading) {
      return <LoadingMessage />;
    }
    return null;
  };

  const ShowErrorMessage = () => {
    if (error) {
      return (
        <SystemMessageEntry>
          Error fetching response from backend chat bot server
        </SystemMessageEntry>
      );
    }
    return null;
  };

  return (
    <InfoCard>
      <VirtualAssistant
        title="inScope AI Search"
        inputPlaceholder="Ask a question"
        message={userInputMessage}
        isSendButtonDisabled={loading}
        onChangeMessage={(_event, value) => {
          setUserInputMessage(value);
        }}
        onSendMessage={SendMessageHandler}
      >
        <ConversationAlert title="AI Will search documentation and then summarize and synthesize an answer">
          Very any information before taking action.
        </ConversationAlert>
        <Conversation />
        <ShowLoadingMessage />
        <ShowErrorMessage />
      </VirtualAssistant>
    </InfoCard>
  );
};
