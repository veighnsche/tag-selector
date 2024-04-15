export interface LlmMessageType<ROLE = 'system' | 'user' | 'assistant'> {
  role: ROLE;
  content: string;
}

export interface LlmChatRequest {
  messages: LlmMessageType[];
  temperature: number;
  max_tokens: number;
  stream: boolean;
  presence_penalty?: number;
  repeat_penalty?: number;
  stop?: string[];
}

export interface LlmChatResponse {
  choices: {
    message: {
      content: string;
    }
  }[];
}

export interface LlmChatChunkResponse {
  choices: {
    delta: {
      content: string;
    }
  }[];
}