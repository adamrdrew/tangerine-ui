import React, { useEffect, useState } from 'react';
import ChatbotWelcomePrompt from '@patternfly/chatbot/dist/dynamic/ChatbotWelcomePrompt';
import { useApi, identityApiRef, configApiRef } from '@backstage/core-plugin-api';
import { useAsync } from 'react-use';
import { makeStyles, useTheme } from '@material-ui/core';
import { customStyles } from '../../lib/styles';

export const WelcomeMessages: React.FC<{
  show: boolean;
  sendMessageHandler: (param: string) => void;
}> = ({ show, sendMessageHandler }) => {
  const [welcomePrompts, setWelcomePrompts] = useState<any>([]);
  const identityApi = useApi(identityApiRef);

  // CSS Overrides to make PF components look normal in Backstage
  const config = useApi(configApiRef);
  const highlightColor = config.getString('convoFrontend.highlightColor');
  const configWelcomePrompts = config.get('convoFrontend.welcomePrompts');
  const theme = useTheme();
  const useStyles = makeStyles(_theme => customStyles(theme, highlightColor));
  const classes = useStyles();

  const { value: profile, loading: _profileLoading } = useAsync(
    async () => await identityApi.getProfileInfo(),
  );

  const makeWelcomePrompts = (prompts: any[]) => {
    return prompts.map((prompt: any) => {
      return {
        title: prompt.title,
        message: prompt.prompt,
        onClick: () => sendMessageHandler(prompt.prompt),
      };
    });
  }

  useEffect(() => {
    if (!show) {
      setWelcomePrompts([]);
    }
  }, [show]);

  useEffect(() => {
    if (welcomePrompts.length > 0) {
      return;
    }
    setWelcomePrompts(makeWelcomePrompts(configWelcomePrompts));
  }, [configWelcomePrompts]);

  const firstName = profile?.displayName?.split(' ')[0];

  if (show && welcomePrompts.length > 0) {
    return (
      <ChatbotWelcomePrompt
        title={`Hi ${firstName || 'there'}!`}
        description="What would you like to know?"
        prompts={welcomePrompts}
        className={classes.userName}
        />
    );
  }
  return null;
};
