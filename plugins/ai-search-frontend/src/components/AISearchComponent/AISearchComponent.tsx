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
import Stack from '@mui/material/Stack';
import { QueryAISearch } from '../../common/queryAISearchBackend';
import { GetAgents } from '../../common/getAllAgents';

import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import { MuiMarkdown } from 'mui-markdown';
import Markdown from "react-markdown";


export const AISearchComponent = () => {
  const title: string = "🍊 Tangerine"

  const [newestUserQuery, setNewestUserQuery] = useState("");
  const [chatConversation, setChatConversation] = useState([]);
  const [agent, setAgent] = useState("");
  const [agentId, setAgentId] = useState(1);

  const { result: agentsResult, loaded: agentsLoaded, error: agentsError } = GetAgents();

  const useStyles = makeStyles(theme => ({
    root: {
      marginBottom: theme.spacing(2),
    },
  }));

  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    const textFieldColor = makeStyles(theme => ({
      root: {
        marginBottom: theme.spacing(2),
      },
    }))
}

  const classes = useStyles();

  const addUserQueryToConversation = (e: any) => {
      setNewestUserQuery(e.target.value)

      setChatConversation(
        [
          ...chatConversation,
          {
            name: "Human",
            comment: {
              value: {
                text_content: e.target.value,
              }
            }
          }
        ]
      )
  }

  const addBotResponseToConversation = (botResponse: any) => {
    if (botResponse) {
      setChatConversation(
        [
          ...chatConversation,
          {
            name: "AI Assistant",
            comment: {
              value: {
                text_content: botResponse.text_content,
                search_metadata: botResponse.search_metadata,
              }
            }
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

  const DisplayChatInteraction = () => {
    setNewestUserQuery("")

    // Had some issues breaking this into JSX partials. Will attempt again in the future.
    return (
        <Box
          height='100vh'
          gap={4}
          p={2}
          sx={{ border: '2px' }}
          overflow="auto"
        >
          <Stack>
            {chatConversation.map(element => (
              <div className={classes.root}>
                <Typography><b>{element.name}</b></Typography>
                <Typography>{element.comment.value.text_content}</Typography>
                { element.name === "AI Assistant"
                ? <Accordion elevation={0}>
                    <AccordionSummary
                      aria-controls="panel1-content"
                      id="panel1-header"
                    >
                      Show search data
                    </AccordionSummary>
                    <AccordionDetails>
                      {element?.comment?.value?.search_metadata?.map(content => (
                        <Accordion elevation={0}>
                          <AccordionSummary
                            aria-controls="panel1-content"
                            id="panel1-header"
                          >
                            <Typography>{content.metadata.filename}</Typography>
                          </AccordionSummary>
                          <AccordionDetails>
                            <Box sx={{ maxWidth: '100%' }}>
                              <Markdown>{content.page_content}</Markdown>
                            </Box>
                          </AccordionDetails>
                        </Accordion>
                      ))} 
                    </AccordionDetails>
                  </Accordion>
                : <div />}
              </div>
            ))}
          </Stack>
        </Box>
    )
  }

  useEffect(() => {
    console.log(botReponseResult)
    addBotResponseToConversation(botReponseResult)
  }, [botReponseResult])

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
    const color = window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "white" : "black"

    return (
        <TextField
          label="Ask a question"
          id="userQuery"
          onKeyDown={(e) => keyPress(e)}
          fullWidth
          sx={{
            input: {
              color: color,
            }
          }}
        />
    )
  }

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
      <Grid container spacing={12}>
        <Grid item xs={12} sm={12}>
          <QueryTextField />
        </Grid>
      </Grid>
      <Stack spacing={2}>
        <DisplayChatInteraction/>
      </Stack>
    </InfoCard>
  )
};
