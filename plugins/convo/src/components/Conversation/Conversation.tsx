import React from 'react';
import Message from '@patternfly/chatbot/dist/dynamic/Message';
import ConvoAvatar from '../../../static/robot.svg';
import UserAvatar from '../../../static/user.svg';
import { humanizeAgentName } from '../../lib/helpers';
import { CitationsCard } from '../Citations/CitationsCard';

import Markdown from 'react-markdown'; // import react-markdown

const BOT = 'ai';
const USER = 'human';

export const Conversation: React.FC<{ conversation: any; agent: any }> = ({
  conversation,
  agent,
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
    if (conversationEntry.hidden) {
      return null;
    }
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
        <React.Fragment key={id}>
          <Message
            key={id}
            name={`${humanizeAgentName(agent.agent_name)} Assistant`}
            role="bot"
            content={conversationEntry.text}
            avatar={ConvoAvatar}
          />
          <CitationsCard
            citations={conversationEntry?.search_metadata}
          />
        </React.Fragment>
      );
    }
    return null;
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
