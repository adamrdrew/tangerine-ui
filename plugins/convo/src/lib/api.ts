const CLIENT = 'convo';

// Public functions

export const sendFeedback = (
  backendUrl: string,
  feedbackOpts: {
    interactionId: string;
    feedback: string;
    like: boolean;
    dislike: boolean;
  },
  callback: (response: any) => void,
) => {
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(feedbackOpts),
  };
  fetch(`${backendUrl}/api/proxy/tangerine/api/feedback`, requestOptions)
    .then(response => {
      if (!response.ok) {
        throw new Error(
          `Server responded with ${response.status}: ${response.statusText}`,
        );
      }
      return response.json();
    })
    .then(response => {
      if (response.error) {
        throw new Error(`Error: ${response.error}`);
      }
      callback(response);
    })
    .catch(error => {
      console.error(`Error sending feedback: ${error.message}`);
      callback({ error: true });
    });
};

export const getAgents = (
  backendUrl: string,
  setAgents: (data: any) => void,
  setSelectedAgent: (id: string) => void,
  setError: (error: boolean) => void,
  setLoading: (loading: boolean) => void,
  setResponseIsStreaming: (streaming: boolean) => void,
) => {
  const requestOptions = {
    headers: { 'Content-Type': 'application/json' },
  };

  fetch(`${backendUrl}/api/proxy/tangerine/api/agents`, requestOptions)
    .then(response => response.json())
    .then(response => {
      setAgents(
        response.data.sort((a, b) => a.agent_name.localeCompare(b.agent_name)),
      );
      // HACK: Look for an agent named "'inscope-all-docs-agent'" and select it by default
      // if it isn't there just use the first agent
      const allDocsAgent = response.data.find(
        agent => agent.agent_name === 'inscope-all-docs-agent',
      );
      if (allDocsAgent) {
        setSelectedAgent(allDocsAgent);
      } else {
        setSelectedAgent(response.data[0]);
      }
    })
    .catch(_error => {
      setError(true);
      setLoading(false);
      setResponseIsStreaming(false);
      console.error(`Error fetching agents from backend`);
    });
};

export const sendUserQuery = async (
  backendUrl: string,
  agentId: number,
  userQuery: any,
  previousMessages: any,
  setLoading: (loading: boolean) => void,
  setError: (error: boolean) => void,
  setResponseIsStreaming: (streaming: boolean) => void,
  handleError: (error: Error) => void,
  updateConversation: (text_content: string, search_metadata: any) => void,
  sessionId: string,
  abortSignal: AbortSignal,
) => {
  try {
    setLoading(true);
    setError(false);
    setResponseIsStreaming(false);

    if (userQuery === '') return;

    const response = await sendQueryToServer(
      agentId,
      userQuery,
      backendUrl,
      previousMessages,
      sessionId,
      abortSignal,
    );
    const reader = createStreamReader(response);

    await processStream(
      reader,
      setLoading,
      setResponseIsStreaming,
      updateConversation,
      abortSignal,
    );
  } catch (error: any) {
    handleError(error);
  }
};

// Private functions
const sendQueryToServer = async (
  agentId: any,
  userQuery: any,
  backendUrl: string,
  previousMessages: string,
  sessionId: string,
  abortSignal: AbortSignal,
) => {
  try {
    const response = await fetch(
      `${backendUrl}/api/proxy/tangerine/api/agents/${agentId}/chat`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: userQuery,
          stream: 'true',
          prevMsgs: previousMessages,
          client: CLIENT,
          interactionId: crypto.randomUUID(),
          sessionId: sessionId,
        }),
        cache: 'no-cache',
        signal: abortSignal,
      },
    );

    if (!response.ok) {
      throw new Error(
        `Server responded with ${response.status}: ${response.statusText}`,
      );
    }

    return response;
  } catch (error) {
    throw new Error(`Failed to send query to server: ${error.message}`);
  }
};

const createStreamReader = (response: Response) => {
  try {
    return response.body
      .pipeThrough(new TextDecoderStream('utf-8'))
      .getReader();
  } catch (error) {
    throw new Error(`Failed to create stream reader: ${error.message}`);
  }
};

const processChunk = (
  value: string,
  updateConversation: (text_content: string, search_metadata: any) => void,
) => {
  try {
    const matches = [...value.matchAll(/data: (\{.*\})\r\n/g)];

    for (const match of matches) {
      const jsonString = match[1];
      const { text_content, search_metadata } = JSON.parse(jsonString);
      if (text_content || search_metadata) {
        updateConversation(text_content, search_metadata);
      }
    }
  } catch (error: any) {
    console.log(`Failed to process chunk: ${error.message}`);
  }
};

const processStream = async (
  reader: ReadableStreamDefaultReader,
  setLoading: (loading: boolean) => void,
  setResponseIsStreaming: (streaming: boolean) => void,
  updateConversation: (
    text_content: string,
    search_metadata: any,
    sessionId: string,
  ) => void,
  abortSignal: AbortSignal,
) => {
  setLoading(false);
  setResponseIsStreaming(true);
  try {
    while (true) {
      if (abortSignal.aborted) {
        console.log('Stream processing aborted.');
        setLoading(false);
        setResponseIsStreaming(false);
        return;
      }
      const chunk = await reader.read();
      const { done, value } = chunk;
      processChunk(value, updateConversation);

      if (done) {
        setLoading(false);
        setResponseIsStreaming(false);
        break;
      }
    }
  } catch (error: any) {
    console.log(`Error processing stream: ${error.message}`);
  }
};
