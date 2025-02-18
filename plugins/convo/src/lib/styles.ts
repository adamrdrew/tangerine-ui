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
});

/*
.pf-chatbot__header .pf-chatbot__actions .pf-v6-c-menu-toggle.pf-m-secondary {
  width: 250px;
}
  */
