import React from 'react';
import { useAppDispatch } from '../../../../store';
import { llmAddUserMessage } from '../../../../store/reducers/llmChat';
import { TextField, InputAdornment, IconButton } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

export const LlmChatInputField = () => {
  const dispatch = useAppDispatch();
  const [input, setInput] = React.useState('');

  // Function to handle click event of send button
  const sendButtonOnClick = () => {
    dispatch(llmAddUserMessage({ content: input }));
    setInput('');
  };

  return (
    <TextField
      fullWidth
      value={input}
      onChange={(e) => setInput(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          sendButtonOnClick();
        }
      }}
      InputProps={{ // This prop is used to access properties of the underlying input element
        endAdornment: (
          <InputAdornment position="end">
            <IconButton onClick={sendButtonOnClick}>
              <SendIcon />
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
};