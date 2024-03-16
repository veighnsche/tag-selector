import { LlmChatRequest } from 'frontend/src/types/llm-chat';
import { SocketEvent } from 'frontend/src/types/socket-event';
import { Socket } from 'socket.io';
import { getLlmResponse } from '../utils/llm-completion';

export function llmCompletionController(socket: Socket) {
  return async (llmChatRequest: LlmChatRequest) => {
    for await (const message of getLlmResponse(llmChatRequest)) {
      socket.emit(SocketEvent.LLM_CHUNK, message);
    }
    socket.emit(SocketEvent.LLM_DONE);
  };
}