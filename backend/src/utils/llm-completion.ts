import axios, { AxiosResponse } from 'axios';
import { LlmChatChunkResponse, LlmChatRequest, LlmChatResponse } from 'frontend/src/types/llm-chat';
import { Stream } from 'openai/streaming';
import { LLM_URL } from '../constants';

export async function getLlmPromptEnhancer(llmPrompt: string, imagePrompt: string): Promise<string> {
  try {
    const response = await axios.post<any, AxiosResponse<LlmChatResponse>, LlmChatRequest>(LLM_URL, {
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

export async function* getLlmResponse({ messages }: LlmChatRequest): AsyncGenerator<string> {
  try {
    const controller = new AbortController();
    const response = await fetch(LLM_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      signal: controller.signal,
      body: JSON.stringify({
        messages,
        temperature: 0.8,
        max_tokens: 100,
        stream: true,
        presence_penalty: 1,
      }),
    }).catch((e) => {
      console.trace(e);
      throw e;
    });

    const stream = new Stream<LlmChatChunkResponse>(response, controller);

    if (stream[Symbol.asyncIterator]) {
      for await (const chunk of stream) {
        yield chunk.choices[0].delta.content;
      }
    }
    else {
      console.error('Stream is not iterable', { stream });
    }
  } catch (error) {
    console.error('Error fetching chat completion:', error);
    throw error; // Re-throw to allow for error handling where the function is used
  }
}
