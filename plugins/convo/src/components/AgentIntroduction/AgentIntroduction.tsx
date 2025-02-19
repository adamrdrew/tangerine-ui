import React, { useEffect } from 'react';
import { sendUserQuery } from '../../lib/api';
import { getAgentIntroductionPrompt } from '../../lib/agentIntroductionPrompt';
import Message from '@patternfly/chatbot/dist/dynamic/Message';
import ConvoAvatar from '../../../static/robot.svg';
import { humanizeAgentName } from '../../lib/helpers';
import { Skeleton } from '@patternfly/react-core';

const AgentIntroductionMessage: React.FC<{
  text: string;
  agent: any;
  loading: boolean;
  show: boolean;
}> = ({ text, agent, loading, show }) => {
  if (!show) {
    return null;
  }
  if (loading) {
    return <Skeleton />;
  }
  return (
    <Message
      key={text}
      name={`${humanizeAgentName(agent.agent_name)} Assistant`}
      role="bot"
      content={text}
      avatar={ConvoAvatar}
      timestamp=' '
    />
  );
};

export const AgentIntroduction: React.FC<{
  agent: any;
  backendUrl: string;
  agentHasBeenSelected: boolean;
  show: boolean;
}> = ({ agent, backendUrl, agentHasBeenSelected, show }) => {
  const [llmResponse, setLlmResponse] = React.useState<string>('👋');
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<boolean>(false);

  const noop = () => {};

  const updateResponse = (text_content: string, _search_metadata: any) => {
    if (!text_content) {
      return;
    }
    setLlmResponse(prev => prev + text_content);
  };

  React.useEffect(() => {
    if (!agentHasBeenSelected) {
      return;
    }
    setLlmResponse('👋');
    handleAgentIntroduction();
  }, [agent]);


  const handleAgentIntroduction = async () => {
    setError(false);
    try {
      await sendUserQuery(
        backendUrl,
        agent.id,
        getAgentIntroductionPrompt(agent.agent_name),
        [],
        setLoading,
        noop,
        noop,
        noop,
        updateResponse,
      );
    } catch (error) {
      console.error('Error fetching agent introduction:', error);
      setError(true);
    }
  };

  if (error) {
    return (
      <section>
        <b>Something went wrong talking to the server.</b>
      </section>
    );
  }

  return (
    <AgentIntroductionMessage
      text={llmResponse}
      agent={agent}
      loading={loading}
      show={show}
    />
  );
};
