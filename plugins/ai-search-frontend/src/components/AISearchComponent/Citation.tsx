import React, { useState } from 'react';
import {
  AccordionItem,
  AccordionToggle,
  AccordionContent,
  CardTitle,
  CardBody,
  TextContent,
  Card,
} from '@patternfly/react-core';

import Markdown from 'markdown-to-jsx';

import { Button } from '@patternfly/react-core';
import { ExternalLinkSquareAltIcon } from '@patternfly/react-icons';

const parseTitle = citation => {
  const title =
    citation.metadata?.title ||
    citation.metadata?.title ||
    citation.metadata?.filename ||
    citation.metadata?.full_path ||
    'Untitled Document';
  // Remove trailing / if present
  if (title.endsWith('\\')) {
    return title.slice(0, -1);
  }
  return title;
};

const CitationContent = ({ citation, expanded }) => {
  const makeLink = metadata => {
    if (metadata?.citation_url) {
      return metadata.citation_url;
    } else {
      // deprecated method, where full_path was used to construct citation url
      // return the path prepended by /docs/
      // if there is a /index.html at the end, remove it
      return `/docs/${metadata.full_path.replace(/\/index.html$/, '')}`;
    }
  };

  if (!expanded) {
    return null;
  }
  return (
    <Card>
      <CardTitle>
        <Button
          variant="link"
          icon={<ExternalLinkSquareAltIcon />}
          iconPosition="end"
          onClick={() => {
            window.open(makeLink(citation.metadata), '_blank');
          }}
        >
          Read Citation Source
        </Button>
      </CardTitle>
      <CardBody>
        <TextContent>
          <Markdown
            style={{ marginLeft: '1em' }}
            options={{
              overrides: {
                a: {
                  component: 'a',
                  props: {
                    target: '_blank',
                    title: 'Note: Relative links are broken and will not work.',
                  },
                },
              },
            }}
          >
            {citation.page_content}
          </Markdown>
        </TextContent>
      </CardBody>
    </Card>
  );
};

const Citation = ({ citation }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <AccordionItem>
      <AccordionToggle
        onClick={() => setExpanded(!expanded)}
        isExpanded={expanded}
      >
        {parseTitle(citation)}
      </AccordionToggle>
      <AccordionContent isHidden={!expanded}>
        <CitationContent citation={citation} expanded={expanded} />
      </AccordionContent>
    </AccordionItem>
  );
};

const areEqual = (prevProps, nextProps) => {
  return prevProps.citation.page_content === nextProps.citation.page_content;
};

export default React.memo(Citation);
