import React from 'react';
import Message from '@patternfly/chatbot/dist/dynamic/Message';
import ConvoAvatar from '../../../static/avatar.png';
import UserAvatar from '../../../static/user.png';

import Markdown from 'react-markdown'; // import react-markdown

const BOT = 'ai';
const USER = 'human';

export const Conversation: React.FC<{ conversation: any }> = ({
  conversation,
}) => {
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

  const renderUserMessage = (conversationEntry: any, id: number) => {
    if (conversationEntry.sender === USER) {
      return (
        <Message
          key={id}
          name="You"
          role="user"
          content={conversationEntry.text}
          avatar={UserAvatar}
        />
      );
    }
    return null;
  };
  const renderBotMessage = (conversationEntry: any, id: number) => {
    if (conversationEntry.sender === BOT) {
      return (
        <Message
          key={id}
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
      );
      return null;
    }
  };

  return conversation.map((conversationEntry: any, index: number) => {
    return (
      <React.Fragment key={index}>
        {renderUserMessage(conversationEntry, index)}
        {renderBotMessage(conversationEntry, index)}
      </React.Fragment>
    );
  });
};
