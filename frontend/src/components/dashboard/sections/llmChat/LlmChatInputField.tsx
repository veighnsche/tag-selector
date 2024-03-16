import SendIcon from '@mui/icons-material/Send';
import { IconButton, InputAdornment, TextField } from '@mui/material';
import React from 'react';
import { useEmitters } from '../../../../hooks/useEmitters';
import { useAppDispatch, useAppSelector } from '../../../../store';
import { llmAddUserMessage, selectLlmChatMessages } from '../../../../store/reducers/llmChat';

export const LlmChatInputField = () => {
  const dispatch = useAppDispatch();
  const [input, setInput] = React.useState('');
  const messages = useAppSelector(selectLlmChatMessages);
  const emit = useEmitters();

  // Function to handle click event of send button
  const sendButtonOnClick = () => {
    dispatch(llmAddUserMessage({ content: input }));
    emit.sendMessage({
      messages: [
        ...messages,
        {
          role: 'user',
          content: input,
        },
      ],
    });
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