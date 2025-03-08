import React from 'react';
import Message from '@patternfly/chatbot/dist/dynamic/Message';
import ConvoAvatar from '../../../static/robot.svg';
import UserAvatar from '../../../static/user.svg';
import { humanizeAgentName } from '../../lib/helpers';
import { CitationsCard } from '../Citations/CitationsCard';
import { customStyles } from '../../lib/styles';
import { makeStyles } from '@material-ui/core/styles';
import { Feedback } from '../Feedback/Feedback';
import { useApi, configApiRef } from '@backstage/core-plugin-api';
const BOT = 'ai';
const USER = 'human';


export const Conversation: React.FC<{ conversation: any; agent: any }> = ({
  conversation,
  agent,
}) => {
  const config = useApi(configApiRef);
  const highlightColor = config.getString('convoFrontend.highlightColor');
  const useStyles = makeStyles(theme => customStyles(theme, highlightColor));
  const classes = useStyles();

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
          timestamp=" "
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
            timestamp=" "
          />
          <Feedback interactionId={conversationEntry.interactionId} />
          <CitationsCard citations={conversationEntry?.search_metadata} />
        </React.Fragment>
      );
    }
    return null;
  };

  return conversation.map((conversationEntry: any, index: number) => {
    return (
      <React.Fragment key={index}>
        <div className={classes.messageTextContentFix}>
          {renderUserMessage(conversationEntry, index)}
          {renderBotMessage(conversationEntry, index)}
        </div>
      </React.Fragment>
    );
  });
};
