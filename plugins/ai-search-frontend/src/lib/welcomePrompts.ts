export const getWelcomePrompts = (sendMessageHandler: (message: string) => void) => {
    const allWelcomePrompts = [
      {
        title: 'Learn about Incident Response',
        message: 'What is our incident response process?',
        onClick: () => {
          sendMessageHandler('What is our incident response process?');
        },
      },
      {
        title: 'Get up to speed on Konflux',
        message: 'Give me a general overview of Konflux.',
        onClick: () => {
          sendMessageHandler('Give me a general overview of Konflux.');
        },
      },
      {
        title: 'Get an education in testing',
        message: 'Where can I find more information about how bonfire works in smoke tests?',
        onClick: () => {
          sendMessageHandler('Where can I find more information about how bonfire works in smoke tests?');
        },
      },
      {
        title: 'Find your missing metrics',
        message: 'I am unable to see metrics in app sre prometheus, what could be some reasons?',
        onClick: () => {
          sendMessageHandler('I am unable to see metrics in app sre prometheus, what could be some reasons?');
        },
      },
      {
        title: 'Add your own chat assistant',
        message: 'How do I add my docs to Convo?',
        onClick: () => {
          sendMessageHandler('How do I add my docs to Convo?');
        },
      },
    ];
  
    const promptCount = allWelcomePrompts.length;
  
    const randomIndexOne = Math.floor(Math.random() * promptCount);
    let randomIndexTwo = randomIndexOne
    while (randomIndexOne === randomIndexTwo) {
      randomIndexTwo = Math.floor(Math.random() * promptCount);
    }
  
    return [
      allWelcomePrompts[randomIndexOne],
      allWelcomePrompts[randomIndexTwo],
    ];
  };