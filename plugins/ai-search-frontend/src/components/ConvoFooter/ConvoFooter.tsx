import React from 'react';
import { MessageBar } from '@patternfly/chatbot/dist/dynamic/MessageBar';
import { ChatbotFooter } from '@patternfly/chatbot/dist/dynamic/ChatbotFooter';
import { ChatbotFootnote } from '@patternfly/chatbot/dist/dynamic/ChatbotFooter';

export const ConvoFooter: React.FC<{
  sendMessageHandler: (msg: string) => void;
  responseIsStreaming: boolean;
}> = ({ sendMessageHandler, responseIsStreaming }) => {
  return (
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
  );
};
