import React, { useEffect, useState } from 'react';
import { useApi, configApiRef } from '@backstage/core-plugin-api';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { Content, Page } from '@backstage/core-components';
import Chatbot, {
  ChatbotDisplayMode,
} from '@patternfly/chatbot/dist/dynamic/Chatbot';
import MessageBox from '@patternfly/chatbot/dist/dynamic/MessageBox';
import { Skeleton } from '@patternfly/react-core';

import { ConvoFooter } from '../ConvoFooter/ConvoFooter';
import { ConvoHeader } from '../ConvoHeader/ConvoHeader';
import { Conversation } from '../Conversation/Conversation';
import { WelcomeMessages } from '../WelcomeMessages/WelcomeMessages';

import { customStyles } from '../../lib/styles';
import { getAgents, sendUserQuery } from '../../lib/api';

// Style imports needed for the virtual assistant component
import '@patternfly/react-core/dist/styles/base.css';
import '@patternfly/chatbot/dist/css/main.css';

// CSS Overrides to make PF components look normal in Backstage
const useStyles = makeStyles(theme => customStyles(theme));

const BOT = 'ai';
const USER = 'human';

export const Convo = () => {
  // Constants
  const classes = useStyles();
  const config = useApi(configApiRef);
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
  const [responseIsStreaming, setResponseIsStreaming] =
    useState<boolean>(false);


    useEffect(() => {
      const handleLinkClick = (event) => {
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
      );
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
  }, [conversation.length]); // Assuming messages is your chat log

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

  const ShowLoadingMessage = () => {
    if (loading) {
      return <Skeleton screenreaderText="Loading response" />;
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

  return (
    <Page themeId="tool">
      <Content className={classes.container}>
        <Chatbot displayMode={ChatbotDisplayMode.embedded}>
          <ConvoHeader
            onAgentSelect={(agent: any) => setSelectedAgent(agent)}
            onNewChatClick={setConversation}
            agents={agents}
            selectedAgent={selectedAgent}
          />
          <MessageBox
            className={`${classes.messagebox} ${classes.userMessageText} `}
            style={{ justifyContent: 'flex-end' }}
            announcement="Type your message and hit enter to send"
          >
            <WelcomeMessages
              conversation={conversation}
              sendMessageHandler={sendMessageHandler}
            />
            <Conversation conversation={conversation} />
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
