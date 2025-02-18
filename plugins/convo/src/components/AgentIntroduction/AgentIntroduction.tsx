import React, { useEffect } from 'react';
import { sendUserQuery } from '../../lib/api';
import { getAgentIntroductionPrompt } from '../../lib/agentIntroductionPrompt';
import Message from '@patternfly/chatbot/dist/dynamic/Message';
import ConvoAvatar from '../../../static/robot.svg';
import { humanizeAgentName } from '../../lib/helpers';

const AgentIntroductionMessage = ({text, agent}) => {
  return (
    <Message
      key={text}
      name={`${humanizeAgentName(agent.agent_name)} Assistant`}
      role="bot"
      content={text}
      avatar={ConvoAvatar}
    />
  );
}

export const AgentIntroduction: React.FC<{
  agent: any;
  backendUrl: string;
  agentHasBeenSelected: boolean;
}> = ({ agent, backendUrl, agentHasBeenSelected }) => {
  const [llmResponse, setLlmResponse] = React.useState<string>('');
  const [newToken, setNewToken] = React.useState<string>('');

  const noop = () => {};

  const updateResponse = (text_content: string, _search_metadata: any) => {
    setNewToken(text_content);
  };

  React.useEffect(() => {
    if (!agentHasBeenSelected) {
      return;
    }
    setLlmResponse('');
    handleAgentIntroduction();
  }, [agent]);

  useEffect(() => {
    if (newToken) {
      setLlmResponse(prev => prev + newToken);
    }
  }, [newToken]);

  const handleAgentIntroduction = async () => {
    try {
      await sendUserQuery(
        backendUrl,
        agent.id,
        getAgentIntroductionPrompt(agent.agent_name),
        [],
        noop,
        noop,
        noop,
        noop,
        updateResponse,
      );
    } catch (error) {
      console.error('Error fetching agent introduction:', error);
    }
  };

  return (
    <div>
      {llmResponse && (
        <AgentIntroductionMessage text={llmResponse} agent={agent}/>
      )}
    </div>
  );
};
