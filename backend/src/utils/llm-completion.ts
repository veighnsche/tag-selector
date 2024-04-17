import axios, { AxiosResponse } from 'axios';
import { LlmChatChunkResponse, LlmChatRequest, LlmChatResponse } from 'frontend/src/types/llm-chat';
import { Stream } from 'openai/streaming';
import { LLM_URL } from '../constants';

export async function getLlmPromptEnhancer(llmPrompt: string, imagePrompt: string): Promise<string> {
  // separate the lora's from the tags (lora's are tags that are enclosed with '<lora' and '>')

  const { loras, tags } = imagePrompt.split(', ').reduce((acc, tag) => {
    if (tag.startsWith('<lora') && tag.endsWith('>')) {
      acc.loras.push(tag);
    }
    else {
      acc.tags.push(tag);
    }
    return acc;
  }, {
    loras: [] as string[],
    tags: [] as string[],
  });


  try {
    const response = await axios.post<any, AxiosResponse<LlmChatResponse>, LlmChatRequest>(LLM_URL, {
      messages: [
        { 'role': 'system', 'content': llmPrompt },
        { 'role': 'user', 'content': tags.join(', ') },
      ],
      temperature: 0.5,
      max_tokens: -1,
      stream: false,
      presence_penalty: 1.05,
      repeat_penalty: 1.05,
      stop: ['\n', '###'],
    }, {
      headers: { 'Content-Type': 'application/json' },
    });

    if (loras.length === 0) {
      return response.data.choices[0].message.content;
    }

    return `${loras.join(', ')}, ${response.data.choices[0].message.content}`;
  } catch (error) {
    console.error('Error fetching chat completion:', error);
    return imagePrompt;
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
        max_tokens: -1,
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
