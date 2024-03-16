import styled from '@emotion/styled';
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../store';
import { llmAddAssistantMessage, selectLlmChatMessages } from '../../../../store/reducers/llmChat';
import { SocketEvent } from '../../../../types';
import { LlmMessageType } from '../../../../types/llm-chat';
import { useSocket } from '../../../providers/SocketProvider';

const ChatBubble = styled.div<{ role: LlmMessageType['role'] }>`
    display: inline-block;
    padding: 10px 15px;
    border-radius: 20px;
    max-width: 100%;
    margin: 10px;
    white-space: pre-wrap;
    overflow-wrap: break-word;

    background-color: ${({ role }) => {
        switch (role) {
            case 'user':
                return '#303030'; /* Darker gray for user */
            case 'assistant':
                return '#4258b9'; /* Slightly darker blue for assistant */
            case 'system':
                return '#724835'; /* Slightly muted orange for system */
            default:
                return '#202020'; /* Very dark gray as default */
        }
    }};

    /* Alignment based on role */
    ${(props) => props.role === 'user'
            ? 'align-self: flex-end;'
            : props.role === 'system'
                    ? 'align-self: center; margin: 10px auto;' /* Center system messages with margins */
                    : 'align-self: flex-start;'
    }
`;

const ChatBubbleWrapper = styled.div`
    width: 100%;
    padding: 10px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    overflow-y: auto;
`;

export const LlmChatBubbles = () => {
  const messages = useAppSelector(selectLlmChatMessages);
  const socket = useSocket();
  const [chunks, setChunks] = useState<string>('');
  const dispatch = useAppDispatch();

  useEffect(() => {
    socket.on(SocketEvent.LLM_CHUNK, (chunk: string | null) => {
      if (chunk) {
        setChunks(chunks + chunk);
      }
      else {
        dispatch(llmAddAssistantMessage({ content: chunks }));
        setChunks('');
      }
    });

    return () => {
      socket.off(SocketEvent.LLM_CHUNK);
    };
  });

  return (
    <ChatBubbleWrapper>
      {messages.map((message, index) => (
        <ChatBubble key={index} role={message.role}>
          {message.content}
        </ChatBubble>
      ))}
      {chunks ? (
        <ChatBubble role={'assistant'}>
          {chunks}
        </ChatBubble>
      ) : null}
    </ChatBubbleWrapper>
  );
};