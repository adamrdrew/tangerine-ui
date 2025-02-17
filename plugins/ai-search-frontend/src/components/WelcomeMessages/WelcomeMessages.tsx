import React, { useEffect, useState } from 'react';
import { getWelcomePrompts } from '../../lib/welcomePrompts';
import ChatbotWelcomePrompt from '@patternfly/chatbot/dist/dynamic/ChatbotWelcomePrompt';
import {
    useApi,
    identityApiRef,
  } from '@backstage/core-plugin-api';
import { useAsync } from 'react-use';

export const WelcomeMessages: React.FC<{
  conversation: any[];
  sendMessageHandler: (param: string) => void;
}> = ({ conversation, sendMessageHandler }) => {

  const [welcomePrompts, setWelcomePrompts] = useState<any>([]);
  const identityApi = useApi(identityApiRef);

  const { value: profile, loading: _profileLoading } = useAsync(
    async () => await identityApi.getProfileInfo(),
  );

 useEffect(() => {
    if (conversation.length === 0) {
      setWelcomePrompts([]);
    }
  }, [conversation]);
  
  useEffect(() => {
    if (welcomePrompts.length > 0) {
      return;
    }
    setWelcomePrompts(getWelcomePrompts(sendMessageHandler));
  }, [welcomePrompts]);

  if (conversation.length === 0 && welcomePrompts.length > 0) {
    return (
      <ChatbotWelcomePrompt
        title={`Hi ${profile?.displayName || 'there'}!`}
        description="What would you like to know?"
        prompts={welcomePrompts}
      />
    );
  }
  return null;
};
