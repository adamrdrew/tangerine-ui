import React, { useEffect, useState } from 'react';
import { useApi, configApiRef } from '@backstage/core-plugin-api';
import { useTheme } from '@material-ui/core/styles';
import VirtualAssistant from '@patternfly/virtual-assistant/dist/dynamic/VirtualAssistant';
import ConversationAlert from '@patternfly/virtual-assistant/dist/esm/ConversationAlert';
import AssistantMessageEntry from '@patternfly/virtual-assistant/dist/dynamic/AssistantMessageEntry';
import UserMessageEntry from '@patternfly/virtual-assistant/dist/dynamic/UserMessageEntry';
import LoadingMessage from '@patternfly/virtual-assistant/dist/esm/LoadingMessage';
import SystemMessageEntry from '@patternfly/virtual-assistant/dist/esm/SystemMessageEntry';
import VirtualAssistantAction from '@patternfly/virtual-assistant/dist/dynamic/VirtualAssistantAction';
import { TrashIcon } from '@patternfly/react-icons';
import { Page, PageSection, PageSectionVariants } from '@patternfly/react-core';
import Citations from './Citations';
import {
  Form,
  FormGroup,
  FormSelect,
  FormSelectOption,
} from '@patternfly/react-core';

// Style imports needed for the virtual assistant component
import '@patternfly/react-core/dist/styles/base.css';
import '@patternfly/react-styles';
import '@patternfly/patternfly/patternfly-addons.css';

export const AISearchComponent = () => {
  // Constants
  const BOT = 'ai';
  const USER = 'human';
  const config = useApi(configApiRef);
  const backendUrl = config.getString('backend.baseUrl');
  const theme = useTheme();
  const isDarkMode = theme.palette.type === 'dark';

  // State
  const [userInputMessage, setUserInputMessage] = useState<string>('');
  const [conversation, setConversation] = useState([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [agents, setAgents] = useState<any>([]);
  const [selectedAgent, setSelectedAgent] = useState<any>({});

  // Side Effects

  // On component mount get the agents and modify the PF card style
  useEffect(() => {
    getAgents();
    modifyPFCardStyle();
  }, []);

  // Whenever the conversation changes,
  // If the last message in the conversation is from the user and the bot is not typing, send the user query
  useEffect(() => {
    if (
      conversation.length > 0 &&
      conversation[conversation.length - 1].sender === USER &&
      !loading
    ) {
      sendUserQuery(1, conversation[conversation.length - 1].text);
    }
  }, [conversation]);

  // If we are loading, clear the user input message
  useEffect(() => {
    if (loading) {
      setUserInputMessage('');
    }
  }, [loading]);

  // Functions

  const getAgents = () => {
    const requestOptions = {
      headers: { 'Content-Type': 'application/json' },
    };

    fetch(`${backendUrl}/api/proxy/backend/api/agents`, requestOptions)
      .then(response => response.json())
      .then(response => {
        setAgents(response.data);
        setSelectedAgent(response.data[0]);
      })
      .catch(_error => {
        setError(true);
        console.error(`Error fetching agents from backend`);
      });
  };

  // This is pretty scary
  // I need to override some of the patternfly styles because the virtual assistant component is not responsive
  // It has a fixed size and that doesn't work for us
  const modifyPFCardStyle = () => {
    const style = document.createElement('style');
    style.innerHTML = `
      .card-0-3-1 {
        height: 100% !important;
        max-height: 100% !important; /* Ensures the element doesn't grow beyond the parent's height */
        width: 100% !important;
        border-radius: 0 !important;
        overflow: hidden !important; /* Prevents overflow if content grows */
        box-sizing: border-box; /* Includes padding and border in height calculation */
        display: flex; /* Flexbox to manage layout within the parent */
      }

      .cardBody-0-3-6 {
        max-height: 100% !important;
        height: 30px !important; /*This is black magic. It forces a correct height even though it looks wrong */
        box-sizing: border-box; /* Includes padding and border in height calculation */
      }
    `;
    // Append the style element to the document head
    document.head.appendChild(style);
  };

  const sendUserQuery = async (agentId: number, userQuery: any) => {
    setLoading(true);
    setError(false);

    if (userQuery !== '') {
      await fetch(
        `${backendUrl}/api/proxy/backend/api/agents/${selectedAgent.id}/chat`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            query: userQuery,
            stream: false,
            prvMsgs: conversation,
          }),
          cache: 'no-cache',
        },
      )
        .then(response => response.json())
        .then(response => {
          setLoading(false);
          const conversationEntry = {
            text: response.text_content,
            sender: BOT,
            search_metadata: response.search_metadata,
          };
          setConversation([...conversation, conversationEntry]);
        })
        .catch(_error => {
          setLoading(false);
          setError(true);
          console.error(`Error fetching response from backend chat bot server`);
        });
    }
  };

  const sendMessageHandler = (msg: string) => {
    setUserInputMessage('');
    const conversationEntry = {
      text: msg,
      sender: USER,
    };
    setConversation([...conversation, conversationEntry]);
  };

  // Components

  const AgentSelector = () => {
    return (
      <Form>
        <FormGroup label="Select an agent to chat with" fieldId="select-agent">
          <FormSelect
            id="select-agent"
            aria-label="Select an agent to chat with."
            value={selectedAgent.id}
            onChange={(_event, selection) => {
              const agent = agents.find(
                agent => agent.id === parseInt(selection),
              );
              setSelectedAgent(agent);
            }}
          >
            {agents.map((agent, index) => (
              <FormSelectOption
                key={index}
                value={agent.id}
                label={agent.agent_name}
              />
            ))}
          </FormSelect>
        </FormGroup>
      </Form>
    );
  };

  const Conversation = () => {
    return conversation.map((conversationEntry, index) => {
      if (conversationEntry.sender === USER) {
        return (
          <UserMessageEntry key={index}>
            {conversationEntry.text}
          </UserMessageEntry>
        );
      }
      if (conversationEntry.sender === BOT) {
        return (
          <React.Fragment>
            <AssistantMessageEntry key={index}>
              {conversationEntry.text}
            </AssistantMessageEntry>
            <Citations conversationEntry={conversationEntry} />
          </React.Fragment>
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
    <Page>
      <PageSection
        variant={
          isDarkMode ? PageSectionVariants.darker : PageSectionVariants.light
        }
      >
        <div class={isDarkMode ? 'pf-v5-theme-dark card-0-3-1' : 'card-0-3-1'}>
          <VirtualAssistant
            title="inScope AI Search"
            inputPlaceholder="Ask a question"
            message={userInputMessage}
            isSendButtonDisabled={loading}
            onChangeMessage={(_event, value) => {
              setUserInputMessage(value);
            }}
            onSendMessage={sendMessageHandler}
            actions={
              <React.Fragment>
                <VirtualAssistantAction
                  aria-label="Clear Conversation"
                  onClick={() => {
                    setConversation([]);
                  }}
                >
                  <TrashIcon />
                </VirtualAssistantAction>
              </React.Fragment>
            }
          >
            <AgentSelector />
            <br />
            <ConversationAlert title="AI will search documentation and then summarize and synthesize an answer.">
              Verify any information before taking action.
            </ConversationAlert>
            <Conversation />
            <ShowLoadingMessage />
            <ShowErrorMessage />
          </VirtualAssistant>
        </div>
      </PageSection>
    </Page>
  );
};
