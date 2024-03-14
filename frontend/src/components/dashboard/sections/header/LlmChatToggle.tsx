import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import { Button } from '@mui/material';
import React from 'react';

export const LlmChatToggle = () => {
  return (
    <Button
      variant="contained"
      color="secondary"
      onClick={() => {
        alert('Chat is not implemented');
      }}
    >
      <ChatBubbleIcon />
    </Button>
  );
};
