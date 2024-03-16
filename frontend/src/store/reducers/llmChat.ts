import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';
import { LlmMessageType } from '../../types/llm-chat';

interface LlmChatState {
  enabled: boolean;
  messages: LlmMessageType[];
}

const initialState: LlmChatState = {
  enabled: false,
  messages: [
    { role: 'system', content: 'Welcome to the chat!' },
    { role: 'user', content: 'Hello, I have a question.' },
    { role: 'assistant', content: 'Sure, what can I help you with?' },
  ],
};

export const llmChatSlice = createSlice({
  name: 'llmChat',
  initialState,
  reducers: {
    llmToggleEnabled: (state) => {
      state.enabled = !state.enabled;
    },
    llmAddSystemMessage: (state, action: PayloadAction<{ content: string }>) => {
      state.messages.push({ role: 'system', content: action.payload.content });
    },
    llmAddUserMessage: (state, action: PayloadAction<{ content: string }>) => {
      state.messages.push({ role: 'user', content: action.payload.content });
    },
    llmAddAssistantMessage: (state, action: PayloadAction<{ content: string }>) => {
      state.messages.push({ role: 'assistant', content: action.payload.content });
    },
    llmEditContent: (state, action: PayloadAction<{ index: number; content: string }>) => {
      state.messages[action.payload.index].content = action.payload.content;
    },
    llmEditRole: (state, action: PayloadAction<{ index: number; role: LlmMessageType['role'] }>) => {
      state.messages[action.payload.index].role = action.payload.role;
    },
    llmRemoveMessage: (state, action: PayloadAction<{ index: number }>) => {
      state.messages.splice(action.payload.index, 1);
    },
    llmClearMessages: (state) => {
      state.messages = [];
    },
  },
});

export const {
  llmToggleEnabled,
  llmAddSystemMessage,
  llmAddUserMessage,
  llmAddAssistantMessage,
  llmEditContent,
  llmEditRole,
  llmRemoveMessage,
  llmClearMessages,
} = llmChatSlice.actions;

export const selectLlmChatEnabled = createSelector(
  (state: { llmChat: LlmChatState }) => state.llmChat.enabled,
  (enabled) => enabled
);

export const selectLlmChatMessages = createSelector(
  (state: { llmChat: LlmChatState }) => state.llmChat.messages,
  (messages) => messages
);

export const llmChatReducer = llmChatSlice.reducer;
