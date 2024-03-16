export interface LlmMessageType {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface LlmChatRequest {
  messages: LlmMessageType[];
  temperature: number;
  max_tokens: number;
  stream: boolean;
  presence_penalty?: number;
  stop?: string[];
}

export interface LlmChatResponse {
  choices: {
    message: {
      content: string;
    }
  }[];
}