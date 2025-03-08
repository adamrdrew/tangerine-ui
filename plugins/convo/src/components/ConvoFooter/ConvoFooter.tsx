import React from 'react';
import { MessageBar } from '@patternfly/chatbot/dist/dynamic/MessageBar';
import { ChatbotFooter } from '@patternfly/chatbot/dist/dynamic/ChatbotFooter';
import { ChatbotFootnote } from '@patternfly/chatbot/dist/dynamic/ChatbotFooter';
import { makeStyles, useTheme } from '@material-ui/core';
import { customStyles } from '../../lib/styles';
import { configApiRef, useApi } from '@backstage/core-plugin-api';

export const ConvoFooter: React.FC<{
  sendMessageHandler: (msg: string) => void;
  responseIsStreaming: boolean;
}> = ({ sendMessageHandler, responseIsStreaming }) => {
  // CSS Overrides to make PF components look normal in Backstage
  const theme = useTheme();
  const config = useApi(configApiRef);
  const title = config.getString('convoFrontend.title');
  const safetyTitle = config.getString('convoFrontend.safetyMessage.title');
  const safetyContent = config.getString('convoFrontend.safetyMessage.content');
  const highlightColor = config.getString('convoFrontend.highlightColor');
  const useStyles = makeStyles(_theme => customStyles(theme, highlightColor));
  const classes = useStyles();
  return (
    <ChatbotFooter>
      <div className={classes.userInput}>
        <MessageBar
          onSendMessage={sendMessageHandler}
          hasAttachButton={false}
          isSendButtonDisabled={responseIsStreaming}
          className={classes.userInput}
        />
      </div>
      <div className={classes.footerText}>
        <ChatbotFootnote
          label={`${title} uses AI. Check for mistakes.`}
          popover={{
            title: safetyTitle,
            description: safetyContent,
          }}
        />
      </div>
    </ChatbotFooter>
  );
};
