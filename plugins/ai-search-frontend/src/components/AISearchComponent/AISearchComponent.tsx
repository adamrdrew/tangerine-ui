import React, { useEffect, useState } from 'react';
import { useAsync } from 'react-use';
import {
  useApi,
  identityApiRef,
  configApiRef,
} from '@backstage/core-plugin-api';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { Content, Page } from '@backstage/core-components';
import Chatbot, {
  ChatbotDisplayMode,
} from '@patternfly/chatbot/dist/dynamic/Chatbot';
import ChatbotWelcomePrompt from '@patternfly/chatbot/dist/dynamic/ChatbotWelcomePrompt';
import ChatbotConversationHistoryNav from '@patternfly/chatbot/dist/dynamic/ChatbotConversationHistoryNav';
import {
  ChatbotHeader,
  ChatbotHeaderMain,
  ChatbotHeaderMenu,
  ChatbotHeaderActions,
  ChatbotHeaderTitle,
  ChatbotHeaderOptionsDropdown,
  ChatbotHeaderSelectorDropdown,
} from '@patternfly/chatbot/dist/dynamic/ChatbotHeader';
import {
  Brand,
  Bullseye,
  Checkbox,
  DropdownGroup,
  DropdownItem,
  DropdownList,
  FormGroup,
  Stack,
} from '@patternfly/react-core';
import MessageBox from '@patternfly/chatbot/dist/dynamic/MessageBox';
import Message from '@patternfly/chatbot/dist/dynamic/Message';
import ConvoAvatar from '../../../static/avatar.png';
import { ChatbotFootnote } from '@patternfly/chatbot/dist/dynamic/ChatbotFooter';
import UserAvatar from '../../../static/user.png';

import { MessageBar } from '@patternfly/chatbot/dist/dynamic/MessageBar';
import { ChatbotFooter } from '@patternfly/chatbot/dist/dynamic/ChatbotFooter';
import Markdown from 'react-markdown'; // import react-markdown
import {
  Title,
  FormSelect,
  FormSelectOption,
  Button,
} from '@patternfly/react-core';
import Citations from './Citations';

// Style imports needed for the virtual assistant component
import '@patternfly/react-core/dist/styles/base.css';
import '@patternfly/chatbot/dist/css/main.css';

const BOT = 'ai';
const USER = 'human';

// CSS Overrides to make PF components look normal in Backstage
const useStyles = makeStyles(theme => ({
  prompt: {
    'justify-content': 'flex-end',
  },
  messagebox: {
    maxWidth: 'unset !important',
    padding: '2em',
  },
  container: {
    maxWidth: 'unset !important',
    padding: '0px',
  },
  userMessageText: {
    '& div.pf-chatbot__message--user': {
      '& div.pf-chatbot__message-text': {
        '& p': {
          color: theme.palette.common.white,
        },
      },
    },
  },
  header: {
    padding: `${theme.spacing(3)}px !important`,
  },
  headerTitle: {
    justifyContent: 'left !important',
  },
  footer: {
    '&>.pf-chatbot__footer-container': {
      width: '95% !important',
      maxWidth: 'unset !important',
    },
  },
}));

const Conversation = ({ conversation }: { conversation: any }) => {
  const transformCitationsToSources = (conversation_entry: any) => {
    if (!conversation_entry.search_metadata) {
      return { sources: [] };
    }
    const sources = conversation_entry.search_metadata.map((citation: any) => {
      return {
        title: citation.metadata.title,
        link: citation.metadata.citation_url,
        body: Markdown({ children: citation.page_content }),
      };
    });
    return { sources };
  };
  return conversation.map((conversationEntry: any, index: number) => {
    if (conversationEntry.sender === USER) {
      return (
        <Message
          key={index}
          name="You"
          role="user"
          content={conversationEntry.text}
          avatar={UserAvatar}
        />
      );
    }
    if (conversationEntry.sender === BOT) {
      return (
        <React.Fragment key={index}>
          <Message
            name="Convo"
            role="bot"
            content={conversationEntry.text}
            avatar={ConvoAvatar}
            sources={
              conversationEntry.search_metadata
                ? transformCitationsToSources(conversationEntry)
                : undefined
            }
          />
        </React.Fragment>
      );
    }
    return null;
  });
};

export const AISearchComponent = () => {
  // Constants
  const classes = useStyles();
  const config = useApi(configApiRef);
  const backendUrl = config.getString('backend.baseUrl');
  const theme = useTheme();
  const isDarkMode = theme.palette.type === 'dark';

  const identityApi = useApi(identityApiRef);
  const { value: profile, loading: profileLoading } = useAsync(
    async () => await identityApi.getProfileInfo(),
  );

  // State
  const [_userInputMessage, setUserInputMessage] = useState<string>('');
  const [conversationList, setConversationList] = useState<any>([]);
  const [conversation, setConversation] = useState([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [agents, setAgents] = useState<any>([]);
  const [selectedAgent, setSelectedAgent] = useState<any>({});
  const [responseIsStreaming, setResponseIsStreaming] =
    useState<boolean>(false);

  const welcomePrompts = [
    {
      title: 'Learn about Incident Response',
      message: 'What is our incident response process?',
      onClick: () => {
        sendMessageHandler('What is our incident response process?');
      },
    },
    {
      title: 'Get up to speed on Konflux',
      message: 'Give me a general overview of Konflux.',
      onClick: () => {
        sendMessageHandler('Give me a general overview of Konflux.');
      },
    },
  ];

  // Side Effects
  useEffect(() => {
    if (agents.length !== 0) {
      return;
    }
    getAgents();
  }, [agents]);

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
        // HACK: Look for an agent named "'inscope-all-docs-agent'" and select it by default
        // if it isn't there just use the first agent
        const allDocsAgent = response.data.find(
          agent => agent.agent_name === 'inscope-all-docs-agent',
        );
        if (allDocsAgent) {
          setSelectedAgent(allDocsAgent);
        } else {
          setSelectedAgent(response.data[0]);
        }
      })
      .catch(_error => {
        setError(true);
        setLoading(false);
        setResponseIsStreaming(false);
        console.error(`Error fetching agents from backend`);
      });
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

  const previousMessages = () => {
    // We want everything in the conversations array EXCEPT the last message
    // This is because the last message is the one that the user just sent
    // and the server gets mad if the previous messages aren't exactly
    // alternating between user and bot
    return conversation.slice(0, conversation.length - 1);
  };

  const sendQueryToServer = async (_agentId: number, userQuery: any) => {
    try {
      const response = await fetch(
        `${backendUrl}/api/proxy/tangerine/api/agents/${selectedAgent.id}/chat`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            query: userQuery,
            stream: 'true',
            prevMsgs: previousMessages(),
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
    setLoading(false);
    setResponseIsStreaming(true);
    try {
      while (true) {
        const chunk = await reader.read();
        const { done, value } = chunk;

        processChunk(value);

        if (done) {
          setLoading(false);
          setResponseIsStreaming(false);
          break;
        }
      }
    } catch (error: any) {
      console.log(`Error processing stream: ${error.message}`);
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
    } catch (error: any) {
      console.log(`Failed to process chunk: ${error.message}`);
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
    setResponseIsStreaming(false);
    setLoading(false);
    console.error(error.message);
  };

  const sendMessageHandler = (msg: string) => {
    setUserInputMessage('');
    const conversationEntry = {
      text: msg,
      sender: USER,
      done: false,
    };
    setConversation([...conversation, conversationEntry]);
  };

  // Components

  const ShowLoadingMessage = () => {
    if (loading) {
      return <div>Loading...</div>;
    }
    return null;
  };

  const ShowErrorMessage = () => {
    if (error) {
      return (
        <Content>
          😿 Something went wrong talking Convo's brain. Try back later.
        </Content>
      );
    }
    return null;
  };

  const AgentSelect = () => {
    return (
      <ChatbotHeaderSelectorDropdown
        value={selectedAgent.agent_name}
        onSelect={(_event, selection) => {
          const agent = agents.find(agent => agent.id === selection);
          setSelectedAgent(agent);
        }}
      >
        <DropdownList>
          {agents.map((agent, index) => (
            <DropdownItem value={agent.id} key={agent.id}>
              {agent.agent_name}
            </DropdownItem>
          ))}
        </DropdownList>
      </ChatbotHeaderSelectorDropdown>
    );
  };

  const NewChatButton = () => {
    return (
      <Button
        onClick={() => {
          setConversation([]);
        }}
      >
        New Chat
      </Button>
    );
  };

  const [drawerIsOpen, setDrawerIsOpen] = useState(false);

  return (
    <Page themeId="tool">
      <Content className={classes.container}>
        <Chatbot displayMode={ChatbotDisplayMode.embedded}>
          <ChatbotConversationHistoryNav
            conversations={[]}
            onDrawerToggle={() => {setDrawerIsOpen(!drawerIsOpen)}}
            isDrawerOpen={drawerIsOpen}
            setIsDrawerOpen={() => {setDrawerIsOpen(false)}}
            displayMode={ChatbotDisplayMode.embedded}
            onNewChat={() => {
              setConversation([]);
            }}
            drawerContent={
              <React.Fragment>
                <ChatbotHeader>
                  <ChatbotHeaderMain>
                    {/*
                    When we are ready to add a menu, uncomment this
                    <ChatbotHeaderMenu onMenuToggle={() => {setDrawerIsOpen(!drawerIsOpen)}} />
                    */}
                    <ChatbotHeaderTitle className={classes.headerTitle}>
                      <Title headingLevel="h1" size="3xl">
                        Convo
                      </Title>
                    </ChatbotHeaderTitle>
                  </ChatbotHeaderMain>
                  <ChatbotHeaderActions>
                    <NewChatButton />
                    <AgentSelect />
                  </ChatbotHeaderActions>
                </ChatbotHeader>

                <MessageBox
                  className={`${classes.messagebox} ${classes.userMessageText} `}
                  style={{ justifyContent: 'flex-end' }}
                  announcement="Type your message and hit enter to send"
                >
                  {conversation.length === 0 && (
                    <ChatbotWelcomePrompt
                      title={`Hi ${profile?.displayName || 'there'}!`}
                      description="What would you like to know?"
                      prompts={welcomePrompts}
                    />
                  )}
                  <Conversation conversation={conversation} />

                  <ShowLoadingMessage />
                  <ShowErrorMessage />
                </MessageBox>
                <ChatbotFooter>
                  <MessageBar
                    onSendMessage={sendMessageHandler}
                    hasAttachButton={false}
                    isSendButtonDisabled={responseIsStreaming}
                  />
                  <ChatbotFootnote
                    label="Convo uses AI. Check for mistakes."
                    popover={{
                      title: 'Verify accuracy',
                      description: `You are about to use a Red Hat AI-powered conversational search
              engine, which utilizes generative AI technology to provide you
              with relevant information. Please do not include any personal
              information in your queries. By proceeding to use the tool, you
              acknowledge that the tool and any output provided are only
              intended for internal use and that information should only be
              shared with those with a legitimate business purpose. Responses
              provided by tools utilizing GAI technology should be reviewed and
              verified prior to use.`,
                    }}
                  ></ChatbotFootnote>
                </ChatbotFooter>
              </React.Fragment>
            }
          />
        </Chatbot>
      </Content>
    </Page>
  );
};
