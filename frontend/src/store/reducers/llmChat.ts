import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';
import { LlmMessageType } from '../../types/llm-chat';

interface LlmChatState {
  enabled: boolean;
  messages: LlmMessageType[];
}

const initialState: LlmChatState = {
  enabled: false,
  messages: [],
};

export const llmChatSlice = createSlice({
  name: 'llmChat',
  initialState,
  reducers: {
    addSystemMessage: (state, action: PayloadAction<{ content: string }>) => {
      state.messages.push({ role: 'system', content: action.payload.content });
    },
    addUserMessage: (state, action: PayloadAction<{ content: string }>) => {
      state.messages.push({ role: 'user', content: action.payload.content });
    },
    addAssistantMessage: (state, action: PayloadAction<{ content: string }>) => {
      state.messages.push({ role: 'assistant', content: action.payload.content });
    },
    editContent: (state, action: PayloadAction<{ index: number; content: string }>) => {
      state.messages[action.payload.index].content = action.payload.content;
    },
    editRole: (state, action: PayloadAction<{ index: number; role: LlmMessageType['role'] }>) => {
      state.messages[action.payload.index].role = action.payload.role;
    },
    removeMessage: (state, action: PayloadAction<{ index: number }>) => {
      state.messages.splice(action.payload.index, 1);
    },
    clearMessages: (state) => {
      state.messages = [];
    },
  },
});

export const {
  addSystemMessage,
  addUserMessage,
  addAssistantMessage,
  editContent,
  editRole,
  removeMessage,
  clearMessages,
} = llmChatSlice.actions;

export const selectMessages = createSelector(
  (state: { llmChat: LlmChatState }) => state.llmChat.messages,
  (messages) => messages
);

export const llmChatReducer = llmChatSlice.reducer;
