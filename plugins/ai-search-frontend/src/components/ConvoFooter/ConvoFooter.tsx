import React from 'react';
import { MessageBar } from '@patternfly/chatbot/dist/dynamic/MessageBar';
import { ChatbotFooter } from '@patternfly/chatbot/dist/dynamic/ChatbotFooter';
import { ChatbotFootnote } from '@patternfly/chatbot/dist/dynamic/ChatbotFooter';
import { makeStyles, useTheme } from '@material-ui/core';
import { customStyles } from '../../lib/styles';

export const ConvoFooter: React.FC<{
  sendMessageHandler: (msg: string) => void;
  responseIsStreaming: boolean;
}> = ({ sendMessageHandler, responseIsStreaming }) => {
  // CSS Overrides to make PF components look normal in Backstage
  const theme = useTheme();
  const useStyles = makeStyles(_theme => customStyles(theme));
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
        />
      </div>
    </ChatbotFooter>
  );
};
