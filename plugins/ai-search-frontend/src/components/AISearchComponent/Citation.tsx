import React, { useState } from 'react';
import { AccordionItem, AccordionToggle, AccordionContent } from '@patternfly/react-core';
import Markdown from 'markdown-to-jsx';

const Citation = ({ citation }) => {
    const [expanded, setExpanded] = useState(false);
    return (
      <AccordionItem>
        <AccordionToggle
          onClick={() => setExpanded(!expanded)}
          isExpanded={expanded}
        >
          {citation.metadata.filename}
        </AccordionToggle>
        <AccordionContent isHidden={!expanded}>
          <Markdown>{citation.page_content}</Markdown>
        </AccordionContent>
      </AccordionItem>
    );
  };

export default Citation;