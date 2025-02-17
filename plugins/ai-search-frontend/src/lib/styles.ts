export const customStyles = (theme: any) => ({
    prompt: {
      'justify-content': 'flex-end',
    },
    messagebox: {
      maxWidth: 'unset !important',
      padding: '2em',
    },
    container: {
      maxWidth: 'unset !important',
      padding: '0px',
    },
    userMessageText: {
      '& div.pf-chatbot__message--user': {
        '& div.pf-chatbot__message-text': {
          '& p': {
            color: theme.palette.common.white,
          },
        },
      },
    },
    header: {
      padding: `${theme.spacing(3)}px !important`,
    },
    footer: {
      '&>.pf-chatbot__footer-container': {
        width: '95% !important',
        maxWidth: 'unset !important',
      },
    },
    headerTitle: {
      justifyContent: 'left !important',
    },
  });