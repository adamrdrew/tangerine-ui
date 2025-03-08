import React, { useEffect, useRef, useState } from 'react';
import { useApi, configApiRef } from '@backstage/core-plugin-api';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { Content, Page } from '@backstage/core-components';
import Chatbot, {
  ChatbotDisplayMode,
} from '@patternfly/chatbot/dist/dynamic/Chatbot';
import MessageBox from '@patternfly/chatbot/dist/dynamic/MessageBox';
import Message from '@patternfly/chatbot/dist/dynamic/Message';
import ConvoAvatar from '../../../static/robot.svg';

import { ConvoFooter } from '../ConvoFooter/ConvoFooter';
import { ConvoHeader } from '../ConvoHeader/ConvoHeader';
import { Conversation } from '../Conversation/Conversation';
import { WelcomeMessages } from '../WelcomeMessages/WelcomeMessages';
import { AgentIntroduction } from '../AgentIntroduction/AgentIntroduction';
import { humanizeAgentName } from '../../lib/helpers';

import { customStyles } from '../../lib/styles';
import { getAgents, sendUserQuery } from '../../lib/api';

// Style imports needed for the virtual assistant component
import '@patternfly/react-core/dist/styles/base.css';
import '@patternfly/chatbot/dist/css/main.css';

const BOT = 'ai';
const USER = 'human';

export const Convo = () => {
  const config = useApi(configApiRef);
  const highlightColor = config.getString('convoFrontend.highlightColor');
  // CSS Overrides to make PF components look normal in Backstage
  const useStyles = makeStyles(theme => customStyles(theme, highlightColor));
  // Constants
  const classes = useStyles();
  const backendUrl = config.getString('backend.baseUrl');
  const theme = useTheme();

  // State
  const [_userInputMessage, setUserInputMessage] = useState<string>('');
  const [conversation, setConversation] = useState([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [agents, setAgents] = useState<any>([]);
  const [selectedAgent, setSelectedAgent] = useState<any>({});
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [agentHasBeenSelected, setAgentHasBeenSelected] =
    useState<boolean>(false);
  const [responseIsStreaming, setResponseIsStreaming] =
    useState<boolean>(false);
  const [showAgentIntroduction, setShowAgentIntroduction] =
    useState<boolean>(false);
  const [sessionId, setSessionId] = useState<string>(crypto.randomUUID());
  const abortControllerRef = useRef(new AbortController());

  useEffect(() => {
    const handleLinkClick = event => {
      const link = event.target.closest('a'); // Matches any <a> element
      if (link) {
        event.preventDefault();
        window.open(link.href, '_blank', 'noopener,noreferrer');
      }
    };

    document.addEventListener('click', handleLinkClick);
    return () => {
      document.removeEventListener('click', handleLinkClick);
    };
  }, []);

  useEffect(() => {
    const currentTheme = theme.palette.type;
    setIsDarkMode(currentTheme === 'dark');
  }, [theme]);

  React.useEffect(() => {
    const htmlTagElement = document.documentElement;
    const THEME_DARK_CLASS = 'pf-v6-theme-dark';
    if (isDarkMode) {
      htmlTagElement.classList.add(THEME_DARK_CLASS);
    } else {
      htmlTagElement.classList.remove(THEME_DARK_CLASS);
    }
  }, [isDarkMode]);

  useEffect(() => {
    if (agents.length !== 0) {
      return;
    }
    getAgents(
      backendUrl,
      setAgents,
      setSelectedAgent,
      setError,
      setLoading,
      setResponseIsStreaming,
    );
  }, [agents]);

  // Whenever the conversation changes,
  // If the last message in the conversation is from the user and the bot is not typing, send the user query
  useEffect(() => {
    if (
      conversation.length > 0 &&
      conversation[conversation.length - 1].sender === USER &&
      !loading
    ) {
      const lastMessage = conversation[conversation.length - 1];
      const previousMessages = conversation.slice(0, conversation.length - 1);
      try {
        sendUserQuery(
          backendUrl,
          selectedAgent.id,
          lastMessage.text,
          previousMessages,
          setLoading,
          setError,
          setResponseIsStreaming,
          handleError,
          updateConversation,
          sessionId,
          abortControllerRef.current.signal,
        );
      } catch (error) {
        console.log('Error sending user query:', error);
      }
    }
  }, [conversation]);

  // If we are loading, clear the user input message
  useEffect(() => {
    if (loading) {
      setUserInputMessage('');
    }
  }, [loading]);

  // If the conversation changes, scroll to the bottom of the message box
  useEffect(() => {
    const messageBox = document.querySelector('.pf-chatbot__messagebox');
    if (messageBox) {
      messageBox.scrollTo({ top: messageBox.scrollHeight, behavior: 'smooth' });
    }
  }, [conversation.length]);

  const updateConversation = (text_content: string, search_metadata: any) => {
    setConversation(prevMessages => {
      const lastMessage = prevMessages[prevMessages.length - 1];
      if (!lastMessage) {
        return prevMessages;
      }

      // If the last message is from the user we need to create a new bot message
      // and we put the text content in the message.
      // In a streaming response this handles the first returned chunk
      if (lastMessage.sender !== BOT) {
        const newMessage = {
          sender: BOT,
          text: text_content,
          done: false,
          //We wont know the interaction ID until we get the last chunk
          interactionId: false,
        };
        return [...prevMessages, newMessage];
      }

      //If we haven't tripped the above conditional we are in a streaming response
      // and we need to update the last message with the new text content
      const updatedMessages = [...prevMessages];

      // If we have text content we need to update the last message
      if (text_content) {
        updatedMessages[updatedMessages.length - 1].text += text_content;
      }

      // If we have search metadata we need to update the last message
      // and set the done flag to true
      if (search_metadata) {
        updatedMessages[updatedMessages.length - 1].search_metadata =
          search_metadata;
        updatedMessages[updatedMessages.length - 1].done = true;
        updatedMessages[updatedMessages.length - 1].interactionId =
          search_metadata[0].interactionId;
      }

      return updatedMessages;
    });
    return true;
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

  const recycleAbortController = () => {
    // Abort previous request
    abortControllerRef.current.abort();
    // Create a new abort controller for the new session
    abortControllerRef.current = new AbortController();
  };

  const agentSelectionHandler = (agent: any) => {
    recycleAbortController();
    setSelectedAgent(agent);
    setConversation([]);
    setError(false);
    setLoading(false);
    setResponseIsStreaming(false);
    setAgentHasBeenSelected(true);
    setShowAgentIntroduction(true);
    setSessionId(crypto.randomUUID());
  };

  const handleNewChatClick = (conversation: any) => {
    recycleAbortController();
    setConversation(conversation);
    setError(false);
    setLoading(false);
    setResponseIsStreaming(false);
    setShowAgentIntroduction(false);
    setSessionId(crypto.randomUUID());
  };

  const ShowLoadingMessage = () => {
    if (loading) {
      return (
        <Message
          name={humanizeAgentName(selectedAgent.agent_name)}
          role="bot"
          avatar={ConvoAvatar}
          timestamp=" "
          isLoading
        />
      );
    }
    return null;
  };

  return (
    <Page themeId="tool">
      <Content className={classes.container}>
        <Chatbot displayMode={ChatbotDisplayMode.embedded}>
          <ConvoHeader
            onAgentSelect={agentSelectionHandler}
            onNewChatClick={handleNewChatClick}
            agents={agents}
            selectedAgent={selectedAgent}
            loading={loading}
          />
          <MessageBox
            className={`${classes.messagebox} ${classes.userMessageText} `}
            style={{ justifyContent: 'flex-end' }}
            announcement="Type your message and hit enter to send"
          >
            <WelcomeMessages
              show={!agentHasBeenSelected}
              sendMessageHandler={sendMessageHandler}
            />
            <AgentIntroduction
              agent={selectedAgent}
              backendUrl={backendUrl}
              agentHasBeenSelected={agentHasBeenSelected}
              show={showAgentIntroduction}
              sessionId={sessionId}
              abortControllerRef={abortControllerRef}
            />
            <Conversation conversation={conversation} agent={selectedAgent} />
            <ShowLoadingMessage />
            <ShowErrorMessage />
          </MessageBox>
          <ConvoFooter
            sendMessageHandler={sendMessageHandler}
            responseIsStreaming={responseIsStreaming}
          />
        </Chatbot>
      </Content>
    </Page>
  );
};
