import React, { useEffect, useState } from 'react';
import { Typography } from '@material-ui/core';
import {
  InfoCard,
} from '@backstage/core-components';
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select  
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import { AgentColumn } from '../AgentsColumn';
import { QueryAISearch } from '../../common/queryAISearchBackend';
import { GetAgents } from '../../common/getAllAgents';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';

export const AISearchComponent = () => {
  const title: string = "🍊 Tangerine"

  const [newestUserQuery, setNewestUserQuery] = useState("");
  const [newestBotResponse, setNewestBotResponse] = useState("");
  const [chatConversation, setChatConversation] = useState([]);
  const [agent, setAgent] = useState("");
  const [agentId, setAgentId] = useState(1);

  const { result: agentsResult, loaded: agentsLoaded, error: agentsError } = GetAgents();

  useEffect(() => {
    if (agentsResult.agent_name) {
      setAgent(agentsResult.agent_name)
      setAgentId(agentsResult.id)
    }
  }, [agentsLoaded])

  const useStyles = makeStyles(theme => ({
    root: {
      marginBottom: theme.spacing(2),
    },
  }));

  const classes = useStyles();

  const addUserQueryToConversation = (e: any) => {
      setNewestUserQuery(e.target.value)

      setChatConversation(
        [
          ...chatConversation,
          {
            name: "Human",
            comment: e.target.value,
          }
        ]
      )
  }

  const addBotResponseToConversation = (botResponse: any) => {
    if (botResponse) {
      setNewestBotResponse(botResponse)

      setChatConversation(
        [
          ...chatConversation,
          {
            name: "AI Assistant",
            comment: botResponse,
          }
        ]
      )
    }
  }

  const keyPress = (e) => {
    if(e.keyCode === 13){
      console.log('value', e.target.value);

      addUserQueryToConversation(e)

      console.log(chatConversation)
    }
  }

  const { result: botReponseResult, loaded: botReponseLoaded, error: botResponseError } = QueryAISearch(agentId, newestUserQuery);

  useEffect(() => {
    console.log(botReponseResult)
    addBotResponseToConversation(botReponseResult.text_content)
  }, [botReponseResult])


  const DisplayChatInteraction = () => {
    return (
        <Box
          height={550}
          my={4}
          display="flex"
          gap={4}
          p={2}
          sx={{ border: '2px' }}
          overflow="auto"
        >
          <Stack>
            {chatConversation.map(element => (
              <div className={classes.root}>
                <Typography><b>{element.name}</b></Typography>
                <Typography>{element.comment}</Typography>
              </div>
            ))}
          </Stack>
        </Box>
    )
  }

  const getAgentId = (agentName: string) => {
    console.log(agentsResult)
    return agentsResult.find((item) => item.agent_name === agentName)?.id
  }

  const AgentSelect = () => {
    return (
      <FormControl>
        <InputLabel id="agent-select-label">Agents</InputLabel>
        <Select
          labelId="agent-select-label"
          id="agent-select"
          value={agent}
          onChange={e => {
            setAgent(e.target.value as string)
            setAgentId(getAgentId(e.target.value))
            // console.log(agentId)
          }}
        >
          {agentsResult.map((agent) => (
            <MenuItem value={agent.agent_name}>{agent.agent_name}</MenuItem>
          ))};
        </Select>
      </FormControl>
    )
  }

  const InfoCardTitle = () => {
    return (
      <Grid container direction="row">
        <Grid item xs={11}>
          {title}
        </Grid>
        <Grid item xs={1}>
          <AgentSelect />
        </Grid>
      </Grid>
    );
  };

  const QueryTextField = () => {
    return (
      <Box sx={{ maxWidth: '100%' }}>
        <TextField
          label="Ask a question"
          id="userQuery"
          onKeyDown={(e) => keyPress(e)}
          fullWidth
        />
      </Box>
    )
  }

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    
  }, [newestUserQuery]);

  if (agentsError) {
    return (
      <InfoCard>
        <Typography align="center" variant="button">
          Error retrieving list of available agents.
        </Typography>
      </InfoCard>
    );
  }

  if (botResponseError) {
    return (
      <InfoCard>
        <Typography align="center" variant="button">
          Error retrieving response from backend server.
        </Typography>
      </InfoCard>
    );
  }
  return (
    <InfoCard title={ <InfoCardTitle />}>
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
