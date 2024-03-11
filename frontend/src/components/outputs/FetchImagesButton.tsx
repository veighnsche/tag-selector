import styled from '@emotion/styled';
import { Button } from '@mui/material';
import { useEmitters } from '../../hooks/useEmitters';
import { useAppSelector } from '../../store';
import { selectImages } from '../../store/reducers/images';
import { GetImagesPathsType } from '../../types/image-output';

const StyledButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== 'rowsPerPage',
})<{
  rowsPerPage: number;
}>`
  width: ${({ rowsPerPage }) => (2 / 3) * (90 / rowsPerPage)}vh;
  height: ${({ rowsPerPage }) => 90 / rowsPerPage}vh;
`;

export const FetchImagesButton = ({ rowsPerPage }: { rowsPerPage: number }) => {
  const images = useAppSelector(selectImages);
  const emit = useEmitters();

  const handleClick = () => {
    // get last image name
    const lastImage = images[images.length - 1];
    const lastImageSplitSlash = lastImage.split('/');
    const lastImageNumber = Number(lastImageSplitSlash[lastImageSplitSlash.length - 1].split('-')[0]);

    const params: GetImagesPathsType = {
      amount: 15,
      toIndex: lastImageNumber,
    };

    emit.fetchImages(params);
  };

  // button with icon
  return (
    <StyledButton rowsPerPage={rowsPerPage} onClick={handleClick} size="large" variant="outlined" color="primary">
      More images
    </StyledButton>
  );
};
