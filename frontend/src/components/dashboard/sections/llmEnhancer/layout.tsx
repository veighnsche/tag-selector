import styled from '@emotion/styled';
import { LlmEnhancer } from './LlmEnhancer';

const LayoutFlex = styled.div`
  width: 100%;
`;

export const LlmEnhancerLayout = () => {
  return (
    <LayoutFlex>
      <LlmEnhancer />
    </LayoutFlex>
  );
};
