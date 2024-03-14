export interface LlmMessageType {
  role: 'system' | 'user' | 'assistant';
  content: string;
}