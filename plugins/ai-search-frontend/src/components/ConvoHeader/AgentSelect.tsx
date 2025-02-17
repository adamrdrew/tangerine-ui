import React, { useEffect, useState } from 'react';
import { ChatbotHeaderSelectorDropdown } from '@patternfly/chatbot/dist/dynamic/ChatbotHeader';
import { DropdownItem, DropdownList } from '@patternfly/react-core';

export const AgentSelect: React.FC<{
  agents: any[];
  onAgentSelect: (agent: any) => void;
  selectedAgent: any;
}> = ({ agents, onAgentSelect, selectedAgent }) => {
  const [agentsCount, setAgentsCount] = useState(agents.length);

  useEffect(() => {
    setAgentsCount(agents.length);
  }, [agents]);

  if (agentsCount === 0) {
    return null;
  }

  return (
    <ChatbotHeaderSelectorDropdown
      value={selectedAgent.agent_name}
      onSelect={(_event, selection) => {
        const agent = agents.find((agent: any) => agent.id === selection);
        onAgentSelect(agent);
      }}
    >
      <DropdownList>
        {agents.map((agent, _index) => (
          <DropdownItem value={agent.id} key={agent.id}>
            {agent.agent_name}
          </DropdownItem>
        ))}
      </DropdownList>
    </ChatbotHeaderSelectorDropdown>
  );
};
