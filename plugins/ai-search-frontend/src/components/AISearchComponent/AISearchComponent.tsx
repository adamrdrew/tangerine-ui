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
import { CommentsIcon, TrashIcon } from '@patternfly/react-icons';
import {
  Grid,
  GridItem,
  Page,
  PageSection,
  PageSectionVariants,
  Split,
  SplitItem,
} from '@patternfly/react-core';
import Citations from './Citations';
import {
  Form,
  FormGroup,
  FormSelect,
  FormSelectOption,
} from '@patternfly/react-core';
import Markdown from 'markdown-to-jsx';

// Style imports needed for the virtual assistant component
import '@patternfly/react-core/dist/styles/base.css';
import '@patternfly/react-styles';
import '@patternfly/patternfly/patternfly-addons.css';
import { Button } from '@patternfly/react-core';

const BOT = 'ai';
const USER = 'human';



const Conversation = ({ conversation }) => {
  return conversation.map((conversationEntry, index) => {
    if (conversationEntry.sender === USER) {
      return (
        <UserMessageEntry key={index}>
          <Markdown>{conversationEntry.text}</Markdown>
        </UserMessageEntry>
      );
    }
    if (conversationEntry.sender === BOT) {
      return (
        <React.Fragment key={index}>
          <AssistantMessageEntry>
            <Markdown>{conversationEntry.text}</Markdown>
          </AssistantMessageEntry>
          <Citations conversationEntry={conversationEntry} />
        </React.Fragment>
      );
    }
    return null;
  });
};

export const AISearchComponent = () => {
  // Constants
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
  const [responseIsStreaming, setResponseIsStreaming] =
    useState<boolean>(false);

  // Side Effects

  // On component mount get the agents and modify the PF card style
  useEffect(() => {
    getAgents();
    modifyPFCardStyle();
    return () => {
      removeCustomStyles();
    };
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

    fetch(`${backendUrl}/api/proxy/tangerine/api/agents`, requestOptions)
      .then(response => response.json())
      .then(response => {
        setAgents(response.data);
        // HACK: Look for an agent named "All-DOCs" and select it by default
        // if it isn't there just use the first agent
        const allDocsAgent = response.data.find(
          agent => agent.agent_name === 'All-DOCs',
        );
        if (allDocsAgent) {
          setSelectedAgent(allDocsAgent);
        } else {
          setSelectedAgent(response.data[0]);
        }
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
    style.id = 'ai-search-styles';
    style.innerHTML = `
    [class*="card-"] {
      height: 100% !important;
      max-height: 100% !important; /* Ensures the element doesn't grow beyond the parent's height */
      width: 100% !important;
      border-radius: 0 !important;
      overflow: hidden !important; /* Prevents overflow if content grows */
      box-sizing: border-box; !important;/* Includes padding and border in height calculation */
      display: flex; !important;/* Flexbox to manage layout within the parent */
    }
  
    [class*="cardBody-"] {
      max-height: 100% !important;
      height: 30px !important; /*This is black magic. It forces a correct height even though it looks wrong */
      box-sizing: border-box; !important;/* Includes padding and border in height calculation */
    }

    .cardThemeBody {
      max-height: 100% !important;
      height: 100% !important; 
      box-sizing: border-box; !important;/* Includes padding and border in height calculation */
    }
  `;
    // Append the style element to the document head
    document.head.appendChild(style);
  };

  const removeCustomStyles = () => {
    const style = document.getElementById('ai-search-styles');
    if (style) {
      style.remove();
    }
  };

  const sendUserQuery = async (agentId: number, userQuery: any) => {
    try {
      setLoading(true);
      setError(false);
      setResponseIsStreaming(false);

      if (userQuery === '') return;

      const response = await sendQueryToServer(agentId, userQuery);
      const reader = createStreamReader(response);

      await processStream(reader);
    } catch (error) {
      handleError(error);
    }
  };

  const sendQueryToServer = async (agentId: number, userQuery: any) => {
    try {
      const response = await fetch(
        `${backendUrl}/api/proxy/tangerine/api/agents/${selectedAgent.id}/chat`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            query: userQuery,
            stream: 'true',
            prvMsgs: conversation,
          }),
          cache: 'no-cache',
        },
      );

      if (!response.ok) {
        throw new Error(
          `Server responded with ${response.status}: ${response.statusText}`,
        );
      }

      return response;
    } catch (error) {
      throw new Error(`Failed to send query to server: ${error.message}`);
    }
  };

  const createStreamReader = (response: Response) => {
    try {
      return response.body
        .pipeThrough(new TextDecoderStream('utf-8'))
        .getReader();
    } catch (error) {
      throw new Error(`Failed to create stream reader: ${error.message}`);
    }
  };

  const processStream = async (reader: ReadableStreamDefaultReader) => {
    try {
      while (true) {
        const chunk = await reader.read();
        const { done, value } = chunk;

        if (done) {
          setResponseIsStreaming(false);
          break;
        }

        setLoading(false);
        setResponseIsStreaming(true);
        processChunk(value);
      }
    } catch (error) {
      throw new Error(`Error processing stream: ${error.message}`);
    }
  };

  const processChunk = (value: string) => {
    try {
      const matches = [...value.matchAll(/data: (\{.*\})\r\n/g)];

      for (const match of matches) {
        const jsonString = match[1];
        const { text_content, search_metadata } = JSON.parse(jsonString);

        if (text_content || search_metadata) {
          updateConversation(text_content, search_metadata);
        }
      }
    } catch (error) {
      throw new Error(`Failed to process chunk: ${error.message}`);
    }
  };

  const updateConversation = (text_content: string, search_metadata: any) => {
    setConversation(prevMessages => {
      const lastMessage = prevMessages[prevMessages.length - 1];

      if (lastMessage.sender !== BOT) {
        const newMessage = {
          sender: BOT,
          text: text_content,
          done: false,
        };
        return [...prevMessages, newMessage];
      }

      const updatedMessages = [...prevMessages];

      if (text_content) {
        updatedMessages[updatedMessages.length - 1].text += text_content;
      }

      if (search_metadata) {
        updatedMessages[updatedMessages.length - 1].search_metadata =
          search_metadata;
        updatedMessages[updatedMessages.length - 1].done = true;
      }

      return updatedMessages;
    });
  };

  const handleError = (error: Error) => {
    setError(true);
    console.error(error.message);
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

  const ChatToolBar = () => {
    return (            <Grid>
      <GridItem span={9} />
      <GridItem span={2}>
        <AgentSelector />
      </GridItem>
      <GridItem span={1}>
        <Button
          variant="control"
          onClick={() => {
            setConversation([]);
          }}
        >
          New Chat
        </Button>
      </GridItem>
    </Grid>)
  }

  const AgentSelector = () => {
    return (
      <Form>
        <FormSelect
          id="select-agent"
          aria-label="Agent Selector"
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
              label={agent.agent_name + '       '}
            />
          ))}
        </FormSelect>
      </Form>
    );
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
        padding={{ default: 'noPadding' }}
        variant={
          isDarkMode ? PageSectionVariants.darker : PageSectionVariants.light
        }
      >
        <div
          class={
            isDarkMode ? 'pf-v5-theme-dark cardThemeBody' : 'cardThemeBody'
          }
        >
          <VirtualAssistant
            icon={CommentsIcon}
            title="Convo"
            inputPlaceholder="What can Convo help you with?"
            message={userInputMessage}
            isSendButtonDisabled={loading || responseIsStreaming}
            onChangeMessage={(_event, value) => {
              setUserInputMessage(value);
            }}
            onSendMessage={sendMessageHandler}
          >
            <ChatToolBar/>
            <br />
            <ConversationAlert title="Convo will search documentation and then synthesize and summarize an answer.">
              Convo is powered by a Large Language Model. Verify any information
              it provides before taking action. The sources used to construct
              your answer are listed in the citations.
            </ConversationAlert>
            <Conversation conversation={conversation} />
            <ShowLoadingMessage />
            <ShowErrorMessage />
          </VirtualAssistant>
        </div>
      </PageSection>
    </Page>
  );
};
