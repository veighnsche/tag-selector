import styled from '@emotion/styled';
import { useAppSelector } from '../../../../store';
import { selectLlmChatMessages } from '../../../../store/reducers/llmChat';
import { LlmMessageType } from '../../../../types/llm-chat';
import { LlmChatInputField } from './llmChatInputField';

const ChatBubble = styled.div<{ role: LlmMessageType['role'] }>`
    display: inline-block;
    padding: 10px 15px;
    border-radius: 20px;
    max-width: 70%;
    margin: 10px;

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

const LayoutFlex = styled.div`
    width: 100%;
    height: 80vh;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
`;

export const LlmChatLayout = () => {
  const messages = useAppSelector(selectLlmChatMessages);
  return (
    <LayoutFlex>
      <ChatBubbleWrapper>
        {messages.map((message, index) => (
          <ChatBubble key={index} role={message.role}>
            {message.content}
          </ChatBubble>
        ))}
      </ChatBubbleWrapper>
      <LlmChatInputField />
    </LayoutFlex>
  );
};
