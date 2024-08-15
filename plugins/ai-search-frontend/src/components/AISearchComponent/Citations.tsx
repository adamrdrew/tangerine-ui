import React, { useState } from 'react';
import { Accordion, ExpandableSection } from '@patternfly/react-core';
import Citation from './Citation';

const Citations = ({ conversationEntry }) => {
    const [expanded, setExpanded] = useState(false);
    const citations = conversationEntry.search_metadata.map(
      (citation, index) => {
        return <Citation key={index} citation={citation} />;
      },
    );
    return (
      <ExpandableSection
        isExpanded={expanded}
        onToggle={() => setExpanded(!expanded)}
        toggleText="Citations"
      >
        <Accordion>{citations}</Accordion>
      </ExpandableSection>
    );
  };

  export default Citations;