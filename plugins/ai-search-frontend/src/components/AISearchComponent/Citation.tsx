import React, { useState } from 'react';
import {
  AccordionItem,
  AccordionToggle,
  AccordionContent,
} from '@patternfly/react-core';
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
        { expanded ? <Markdown>{citation.page_content}</Markdown> : null }
      </AccordionContent>
    </AccordionItem>
  );
};

const areEqual = (prevProps, nextProps) => {
  return prevProps.citation.page_content === nextProps.citation.page_content;
}

export default React.memo(Citation);
