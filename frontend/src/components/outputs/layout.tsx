import { Box } from '@mui/material';
import { ImageListDataWrapper } from './ImageListDataWrapper';
import { ImageList } from './ImageList';

export const OutputsLayout = () => {
  return (
    <ImageListDataWrapper>
      <Box width="100%" display="flex" flexDirection="column" gap="1rem">
        <ImageList />
      </Box>
    </ImageListDataWrapper>
  );
};
