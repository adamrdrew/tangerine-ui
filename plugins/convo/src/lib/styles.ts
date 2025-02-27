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
    '& .pf-chatbot__message--user': {
      '& .pf-chatbot__message-text': {
        backgroundColor: '#EE0000 !important',
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
  redHatRedFGColor: {
    color: `#EE0000 !important`,
  },
  redHatRedBGColor: {
    backgroundColor: `#EE0000 !important`,
  },
  redHatGrayBGColor: {
    backgroundColor: `#EDEDED !important`,
  },
  agentMenu: {
    '& .pf-v6-c-menu-toggle': {
      '--pf-v6-c-menu-toggle--Color': '#EE0000',
      '--pf-v6-c-menu-toggle--BorderColor': '#EE0000',
      '--pf-v6-c-menu-toggle--m-secondary--BorderColor': '#EE0000',
    },
    '& .pf-v6-c-menu-toggle__toggle-icon': {
      '--pf-v6-c-menu-toggle__toggle-icon--Color': '#EE0000',
    },
    '& .pf-v6-c-menu-toggle.pf-m-secondary.pf-v6-c-menu-toggle': {
      width: '250px !important',
    },
  },
  userName: {
    '& .pf-chatbot__hello': {
      color: '#EE0000',
    },
  },
  userInput: {
    '& .pf-chatbot__message-bar:focus-within': {
      boxShadow: 'inset 0 0 0 1px #EE0000 !important',
    },
  },
  footerText: {
    '& .pf-chatbot__footnote': {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    '& .pf-chatbot__footnote > div': {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
    },
    '& .pf-chatbot__footnote .pf-v6-c-button': {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    '& .pf-chatbot__footnote .pf-v6-c-button__text': {
      color: '#EE0000',
    },
    '& .pf-v6-c-menu-toggle .pf-m-secondary ': {
      width: '250px',
    },
  },
  messageTextContentFix: {
    '& .pf-chatbot__message-response': {
      // Treat the whole response as a content block
      '& p, & a, & ol, & ul, & li': {
        fontSize: 'var(--pf-v6-global--FontSize--md)',
        lineHeight: 'var(--pf-v6-global--LineHeight--md)',
        color: 'var(--pf-v6-global--Color--100)',
        marginBottom: 'var(--pf-v6-global--spacer--md)',
      },
      '& a': {
        color: 'var(--pf-v6-global--link--Color)',
        textDecoration: 'underline',
      },
      '& ol, & ul': {
        paddingLeft: 'var(--pf-v6-global--spacer--md)',
      },
    },
  },
});
