import axios, { AxiosResponse } from 'axios';
import { LLM_URL } from '../constants';
import { LlmChatRequest, LlmChatResponse } from 'frontend/src/types/llm-chat';

export async function getLlmPromptEnhancer(llmPrompt: string, imagePrompt: string): Promise<string> {
  try {
    const response = await axios.post<any, AxiosResponse<LlmChatResponse, any>, LlmChatRequest>(LLM_URL, {
      messages: [
        { 'role': 'system', 'content': llmPrompt },
        { 'role': 'user', 'content': imagePrompt },
      ],
      temperature: 0.7,
      max_tokens: -1,
      stream: false,
      presence_penalty: 1,
      stop: ['\n', '###'],
    }, {
      headers: { 'Content-Type': 'application/json' },
    });

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('Error fetching chat completion:', error);
    throw error; // Re-throw to allow for error handling where the function is used
  }
}