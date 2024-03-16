import styled from '@emotion/styled';
import { LlmChatBubbles } from './LlmChatBubbles';
import { LlmChatInputField } from './LlmChatInputField';


const LayoutFlex = styled.div`
    width: 100%;
    height: 80vh;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
`;

export const LlmChatLayout = () => {
  return (
    <LayoutFlex>
      <LlmChatBubbles />
      <LlmChatInputField />
    </LayoutFlex>
  );
};
