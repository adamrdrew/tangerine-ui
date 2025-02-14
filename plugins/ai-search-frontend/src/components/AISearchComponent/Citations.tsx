import React, { useState } from 'react';
import {
  Accordion,
  ExpandableSection,
  AccordionContent,
  AccordionItem,
  AccordionToggle,
} from '@patternfly/react-core';
import Citation from './Citation';



const Citations = ({ conversationEntry }) => {



  if (
    !conversationEntry.search_metadata ||
    conversationEntry.search_metadata.length === 0
  ) {
    return null;
  }

  const [expanded, setExpanded] = useState(false);
  const citations = conversationEntry.search_metadata.map((citation, index) => {
    return (
      <AccordionItem key={index}>
        <AccordionToggle id={index}>
          {citation.metadata.title || citation.metadata.hash}
        </AccordionToggle>
        <AccordionContent>
          {citation.metadata.title }
        </AccordionContent>
      </AccordionItem>
    );
  });
  return (
    <ExpandableSection
      isExpanded={expanded}
      onToggle={() => setExpanded(!expanded)}
      toggleText={`${citations.length} Sources`}
    >
      <Accordion asDefinitionList>Adam</Accordion>
    </ExpandableSection>
  );
};

export default Citations;
