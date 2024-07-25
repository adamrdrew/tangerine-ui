import React, { useEffect, useState } from 'react';
import { Typography } from '@material-ui/core';
import {
  InfoCard,
} from '@backstage/core-components';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';

export const ChatBotComponent = () => {
  const title: string = "InScope Virtual Assistant"

  let [textChatId] = useState(0)
  const [newestUserQuery, setNewestUserQuery] = useState("")
  const [newestBotResponse, setNewestBotResponse] = useState("")
  const [chatConversation, setChatConversation] = useState([]);

  const keyPress = (e) => {
    if(e.keyCode === 13){
      console.log('value', e.target.value);

      setNewestUserQuery(e.target.value)

      // chatConversation.push({
      //   isUser: true,
      //   comment: e.target.value,
      // });

      setChatConversation(
        [
          ...chatConversation,
          {
            isUser: true,
            comment: e.target.value,
          }
        ]
      )

      console.log(chatConversation)
    }
  }

  const DisplayChatInteraction = () => {
    const Item = styled(Paper)(({ theme }) => ({
      backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
      ...theme.typography.body2,
      padding: theme.spacing(1),
      textAlign: 'left',
      color: theme.palette.text.secondary,
    }));
    
    return (
        <div>
          {chatConversation.map(element => (
            <Item>{element.comment}</Item>
          ))}
        </div>
    )
  }

  const QueryTextField = () => {
    return (
      <Box sx={{ maxWidth: '100%' }}>
        <TextField
          label="Ask the chat bot a question"
          id="userQuery"
          onKeyDown={(e) => keyPress(e)}
          fullWidth
        />
      </Box>
    )
  }

  useEffect(() => {
    
  }, [newestUserQuery])

  return (
    <InfoCard title={title}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <QueryTextField />
        </Grid>
      </Grid>
      <Stack spacing={2}>
        <DisplayChatInteraction/>
      </Stack>
    </InfoCard>
  )
};
