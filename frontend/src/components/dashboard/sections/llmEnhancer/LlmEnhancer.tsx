import styled from '@emotion/styled';
import { Checkbox, FormControlLabel, Paper, TextField } from '@mui/material';
import React from 'react';
import { useAppDispatch, useAppSelector } from '../../../../store';
import {
  selectLlmEnhanceEnabled,
  selectLlmEnhancePrompt,
  setLlmEnhanceEnabled,
  setLlmEnhancePrompt,
} from '../../../../store/reducers/inputs';

const StyledPaper = styled(Paper)`
  padding: 0.75rem;
  width: 100%;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
`;

export const LlmEnhancer = () => {
  const dispatch = useAppDispatch();
  const [text, setText] = React.useState('');
  const checked = useAppSelector(selectLlmEnhanceEnabled);
  const prompt = useAppSelector(selectLlmEnhancePrompt);

  React.useEffect(() => {
    setText(prompt);
  }, [prompt]);

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setLlmEnhanceEnabled(event.target.checked));
  };

  const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setText(event.target.value);
  };

  const handleTextBlur = () => {
    dispatch(setLlmEnhancePrompt(text));
  };

  return (
    <StyledPaper elevation={2}>
      <FormControlLabel
        control={<Checkbox checked={checked} onChange={handleCheckboxChange} name="checkbox" color="primary" />}
        label="Enable LLM Enhancer"
      />
      <TextField
        label="Prompt"
        value={text}
        onChange={handleTextChange}
        onBlur={handleTextBlur}
        variant="outlined"
        rows={3}
        multiline
      />
    </StyledPaper>
  );
};
