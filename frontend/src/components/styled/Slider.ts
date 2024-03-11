import styled from '@emotion/styled';
import { FormControl, InputLabel, TextField } from '@mui/material';

export const SliderControl = styled(FormControl)`
  width: 100%;
  transform: translateY(-0.8rem);
`;
export const SliderTextWrapper = styled.div`
  display: flex;
  justify-content: right;
  align-items: end;
  gap: 1rem;
`;
export const SliderLabel = styled(InputLabel)`
  transform: translate(0.8rem, 1.2rem) scale(0.8);
`;
export const SliderTextField = styled(TextField)`
  width: 5rem;
  transform: translateY(0.9rem);
  text-align: right !important;
`;
