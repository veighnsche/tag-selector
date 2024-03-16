import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import { Button } from '@mui/material';
import React from 'react';
import { useAppDispatch, useAppSelector } from '../../../../store';
import { llmToggleEnabled, selectLlmChatEnabled } from '../../../../store/reducers/llmChat';

export const LlmChatToggle = () => {
  const dispatch = useAppDispatch();
  const isEnabled = useAppSelector(selectLlmChatEnabled)

  const buttonColor = isEnabled ? "primary" : "secondary";
  const icon = isEnabled ? <ChatBubbleIcon /> : <ChatBubbleOutlineIcon />;

  return (
    <Button
      variant="contained"
      color={buttonColor}
      onClick={() => {
        dispatch(llmToggleEnabled())
      }}
    >
      {icon}
    </Button>
  );
};
