import React, { useEffect } from 'react';
import {
  Card,
  CardTitle,
  CardBody,
  CardFooter,
  Pagination,
  Divider,
  Button,
  ExpandableSectionToggle,
} from '@patternfly/react-core';

import { ExternalLinkSquareAltIcon } from '@patternfly/react-icons';
import Markdown from 'markdown-to-jsx';

export const CitationsCard: React.FC<{ citations: any[] }> = ({
  citations,
}) => {
  if (!citations || citations.length === 0) {
    return null;
  }

  const [currentCitationIndex, setCurrentCitationIndex] = React.useState(0);
  const [isExpanded, setIsExpanded] = React.useState(false);

  const getCurrentTitle = () =>
    citations[currentCitationIndex]?.metadata?.title || '';
  const getCurrentBody = () =>
    citations[currentCitationIndex]?.page_content || '';
  const getCurrentLink = () =>
    citations[currentCitationIndex]?.metadata?.citation_url || '';

  return (
    <section
      style={{ marginTop: '-40px', marginBottom: '48px', marginLeft: '4.7em' }}
    >
      <div className="pf-v6-c-content">{citations?.length} sources</div>
      <Card style={{ maxWidth: '33%' }} isCompact>
        <CardTitle style={{ position: 'relative' }}>
          <Button
            variant="link"
            icon={<ExternalLinkSquareAltIcon />}
            iconPosition="end"
            onClick={() => window.open(getCurrentLink(), '_blank')}
            style={{
              fontSize: '1rem',
              fontWeight: 'var(--pf-v6-global--FontWeight--bold)',
            }}
          >
            {getCurrentTitle()}
          </Button>

          <ExpandableSectionToggle
            isExpanded={isExpanded}
            onToggle={() => setIsExpanded(!isExpanded)}
            direction="down"
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
            }}
          />
        </CardTitle>
        {isExpanded && (
          <React.Fragment>
            <Divider />
            <CardBody style={{ maxHeight: '300px', overflowY: 'auto' }}>
              <div className="pf-v6-c-content">
                <Markdown>{getCurrentBody()}</Markdown>
              </div>
            </CardBody>

            <Divider />

            <CardFooter>
              <Pagination
                toggleTemplate={({ firstIndex, lastIndex }) => (
                  <React.Fragment>
                    <b>
                      {firstIndex} of {lastIndex}
                    </b>
                  </React.Fragment>
                )}
                perPageOptions={[]}
                itemCount={citations.length}
                page={currentCitationIndex + 1}
                perPage={1}
                onSetPage={(_event, page) => setCurrentCitationIndex(page - 1)}
                onPerPageSelect={() => setCurrentCitationIndex(0)}
                isCompact
                isDisabled={citations.length <= 1}
              />
            </CardFooter>
          </React.Fragment>
        )}
      </Card>
    </section>
  );
};
