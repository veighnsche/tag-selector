import styled from '@emotion/styled';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Paper,
} from '@mui/material';
import React from 'react';
import { AdvancedOptionsLayout } from './sections/advanced/layout';
import { HeaderLayout } from './sections/header/layout';
import { HighResFixLayout } from './sections/highresFix/layout';
import { Optimizers } from './sections/optimizers';
import { OptionsLayout } from './sections/options/layout';
import { OptionsSummary } from './sections/options/OptionsSummary';
import { OutputLayout } from './sections/output/layout';
import { PromptLayout } from './sections/prompt/layout';

const LayoutGrid = styled.main`
  width: 100%;
  height: 100%;

  display: grid;
  gap: 1rem;

  grid-template-columns: 1fr 1fr;
  grid-template-rows: min-content 1fr min-content;
  grid-template-areas:
    'header header'
    'prompt output'
    'options output';
`;

const HeaderArea = styled.header`
  grid-area: header;
`;

const PromptArea = styled.section`
  grid-area: prompt;
  height: 100%;
`;

const OutputArea = styled.section`
  grid-area: output;
`;

const OptionsArea = styled.section`
  grid-area: options;
`;

const StyledPaper = styled(Paper)`
  padding: 0.75rem;
  height: 100%;
`;

enum AccordionNames {
  Options = 'options',
  HighResFix = 'highResFix',
  Optimizers = 'optimizers',
  Advanced = 'advanced',
}

export const DashboardLayout = () => {
  const [expanded, setExpanded] = React.useState<string | false>(false);

  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

  return (
    <LayoutGrid>
      <HeaderArea>
        <StyledPaper>
          <HeaderLayout />
        </StyledPaper>
      </HeaderArea>
      <PromptArea>
        <StyledPaper>
          <PromptLayout />
        </StyledPaper>
      </PromptArea>
      <OutputArea>
        <StyledPaper>
          <OutputLayout />
        </StyledPaper>
      </OutputArea>
      <OptionsArea>
        <Paper>
          <Accordion
            disableGutters
            expanded={expanded === AccordionNames.Options}
            onChange={handleChange(AccordionNames.Options)}
          >
            <AccordionSummary
              expandIcon={
                <ExpandMoreIcon sx={{ transform: 'rotate(180deg)' }} />
              }
            >
              <OptionsSummary />
            </AccordionSummary>
            <AccordionDetails>
              <OptionsLayout />
            </AccordionDetails>
          </Accordion>
          <Accordion
            disableGutters
            expanded={expanded === AccordionNames.HighResFix}
            onChange={handleChange(AccordionNames.HighResFix)}
          >
            <AccordionSummary
              expandIcon={
                <ExpandMoreIcon sx={{ transform: 'rotate(180deg)' }} />
              }
            >
              HighRes Fix
            </AccordionSummary>
            <AccordionDetails>
              <HighResFixLayout />
            </AccordionDetails>
          </Accordion>
          <Accordion
            disableGutters
            expanded={expanded === AccordionNames.Optimizers}
            onChange={handleChange(AccordionNames.Optimizers)}
          >
            <AccordionSummary
              expandIcon={
                <ExpandMoreIcon sx={{ transform: 'rotate(180deg)' }} />
              }
            >
              Optimizers
            </AccordionSummary>
            <AccordionDetails>
              <Optimizers />
            </AccordionDetails>
          </Accordion>
          <Accordion
            disableGutters
            expanded={expanded === AccordionNames.Advanced}
            onChange={handleChange(AccordionNames.Advanced)}
          >
            <AccordionSummary
              expandIcon={
                <ExpandMoreIcon sx={{ transform: 'rotate(180deg)' }} />
              }
            >
              Advanced options
            </AccordionSummary>
            <AccordionDetails>
              <AdvancedOptionsLayout />
            </AccordionDetails>
          </Accordion>
        </Paper>
      </OptionsArea>
    </LayoutGrid>
  );
};
