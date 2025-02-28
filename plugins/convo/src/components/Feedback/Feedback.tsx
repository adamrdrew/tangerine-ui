import React from 'react';
import { sendFeedback } from '../../lib/api';
import { Button, Spinner, Content } from '@patternfly/react-core';
import { configApiRef, useApi } from '@backstage/core-plugin-api';

type FeedbackOpts = {
  interactionId: string;
  feedback: string;
  like: boolean;
  dislike: boolean;
};

export const Feedback: React.FC<{
  interactionId: string;
}> = ({ interactionId }) => {
  const config = useApi(configApiRef);
  const backendUrl = config.getString('backend.baseUrl');
  const [sending, setSending] = React.useState(false);
  const [feedbackSent, setFeedbackSent] = React.useState(false);
  const [error, setError] = React.useState(false);

  const onResponse = (response: any) => {
    setSending(false);
    if (response.error) {
      setError(true);
      setFeedbackSent(false);
    } else {
      setFeedbackSent(true);
    }
  };

  const clickHandler = (feedbackOpts: FeedbackOpts) => {
    setSending(true);
    sendFeedback(backendUrl, feedbackOpts, onResponse);
  };

  const FeedbackUI = () => {
    if (!interactionId) {
      return null;
    }

    if (feedbackSent) {
      return (
        <Content>
          <p><i>Thank you for your feedback!</i></p>
        </Content>
      );
    }

    if (sending) {
      return (
        <Spinner size="sm" aria-label="Contents of the small example" />
      );
    }

    if (error) {
      return (
        <Content>
          <p><i>Error sending feedback.</i></p>
        </Content>
      );
    }

    return (
      <React.Fragment>
        <Button
          variant="link"
          onClick={() =>
            clickHandler({
              like: true,
              dislike: false,
              feedback: '',
              interactionId: interactionId,
            })
          }
        >
          👍
        </Button>
        <Button
          variant="link"
          onClick={() =>
            clickHandler({
              like: false,
              dislike: true,
              feedback: '',
              interactionId: interactionId,
            })
          }
        >
          👎
        </Button>
      </React.Fragment>
    );
  };

  return (
    <section
      style={{ marginTop: '-50px', marginBottom: '42px', marginLeft: '4.7em', minHeight: '40px' }}
    >
      <FeedbackUI />
    </section>
  );
};
