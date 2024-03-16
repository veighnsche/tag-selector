import styled from '@emotion/styled';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Accordion, AccordionDetails, AccordionSummary, Paper } from '@mui/material';
import React from 'react';
import { useAppSelector } from '../../store';
import { selectLlmChatEnabled } from '../../store/reducers/llmChat';
import { AdvancedOptionsLayout } from './sections/advanced/layout';
import { HeaderLayout } from './sections/header/layout';
import { HighResFixLayout } from './sections/highresFix/layout';
import { LlmChatLayout } from './sections/llmChat/LlmChatLayout';
import { LlmEnhancerLayout } from './sections/llmEnhancer/layout';
import { Optimizers } from './sections/optimizers';
import { OptionsLayout } from './sections/options/layout';
import { OptionsSummary } from './sections/options/OptionsSummary';
import { OutputLayout } from './sections/output/layout';
import { PromptLayout } from './sections/prompt/layout';

const LayoutGrid = styled.main<{ llmChat?: boolean }>`
    width: 100%;
    height: 100%;
    display: grid;
    gap: 1rem;
    grid-template-columns: 1fr 1fr ${({ llmChat }) => (llmChat ? '1fr' : '')};
    grid-template-rows: min-content 1fr min-content;

    grid-template-areas: ${
            ({ llmChat }) =>
                    (llmChat
                                    ? `'header header header'
             'prompt output llmChat'
             'options output llmChat'`
                                    : `'header header'
             'prompt output'
             'options output'`
                    )
    };
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

const LlmChatArea = styled.section<{ llmChat?: boolean }>`
    display: ${({ llmChat }) => (llmChat ? 'block' : 'none')};
    grid-area: llmChat;
`;

const StyledPaper = styled(Paper)`
    padding: 0.75rem;
    height: 100%;
`;

enum AccordionNames {
  Options = 'options',
  HighResFix = 'highResFix',
  LlmEnhancer = 'llmEnhancer',
  Optimizers = 'optimizers',
  Advanced = 'advanced',
}

export const DashboardLayout = () => {
  const isLlmChatEnabled = useAppSelector(selectLlmChatEnabled);
  const [expanded, setExpanded] = React.useState<string | false>(false);

  const handleChange = (panel: AccordionNames) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <LayoutGrid llmChat={isLlmChatEnabled}>
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
            <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ transform: 'rotate(180deg)' }} />}>
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
            <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ transform: 'rotate(180deg)' }} />}>
              HighRes Fix
            </AccordionSummary>
            <AccordionDetails>
              <HighResFixLayout />
            </AccordionDetails>
          </Accordion>
          <Accordion
            disableGutters
            expanded={expanded === AccordionNames.LlmEnhancer}
            onChange={handleChange(AccordionNames.LlmEnhancer)}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ transform: 'rotate(180deg)' }} />}>
              LLM Enhancer
            </AccordionSummary>
            <AccordionDetails>
              <LlmEnhancerLayout />
            </AccordionDetails>
          </Accordion>
          <Accordion
            disableGutters
            expanded={expanded === AccordionNames.Optimizers}
            onChange={handleChange(AccordionNames.Optimizers)}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ transform: 'rotate(180deg)' }} />}>
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
            <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ transform: 'rotate(180deg)' }} />}>
              Advanced options
            </AccordionSummary>
            <AccordionDetails>
              <AdvancedOptionsLayout />
            </AccordionDetails>
          </Accordion>
        </Paper>
      </OptionsArea>
      {isLlmChatEnabled ? (
        <LlmChatArea llmChat={isLlmChatEnabled}>
          <StyledPaper>
            <LlmChatLayout />
          </StyledPaper>
        </LlmChatArea>
      ) : null}
    </LayoutGrid>
  );
};
