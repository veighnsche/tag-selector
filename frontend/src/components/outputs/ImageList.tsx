import styled from '@emotion/styled';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import {
  Box,
  Button,
  ButtonGroup,
  IconButton,
  Pagination,
  Tooltip,
} from '@mui/material';
import React, { useEffect, useMemo } from 'react';
import { useViewDimensions } from '../../hooks/useViewDimensions';
import { useAppSelector } from '../../store';
import { selectImages } from '../../store/reducers/images';
import { extractImageSize, prefixWithImageUrl } from '../../utils/files';
import { SeedIcon } from '../icons/SeedIcon';
import { FetchImagesButton } from './FetchImagesButton';
import { ImageDataWrapper } from './ImageDataWrapper';
import { ImageModal } from './ImageModal';

const ImageListWrapper = styled.div<{
  rowsPerPage: number;
}>`
  height: calc(90vh + ${({ rowsPerPage }) => (rowsPerPage - 1) * 4}px);
`;

const ImageListFlex = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 4px;
`;

const ImageButtonsContainer = styled.div<{
  rowsPerPage: number;
}>`
  height: ${({ rowsPerPage }) => 90 / rowsPerPage}vh;
  position: relative;
  cursor: pointer;

  &:hover button {
    opacity: 0.5;
  }
`;

const StyledImage = styled.img<{
  rowsPerPage: number;
}>`
  height: ${({ rowsPerPage }) => 90 / rowsPerPage}vh;

  display: block;
  backface-visibility: hidden;
`;

const OverlayButton = styled(IconButton)`
  position: absolute;

  color: white;
  font-size: 1.5rem;
  opacity: 0;
  transition: all 0.2s ease-in-out;

  &:hover {
    opacity: 1 !important;
  }
`;

const DeleteButton = styled(OverlayButton)`
  top: 0;
  right: 0;

  &:hover {
    color: red;
  }
`;

const SetSeedButton = styled(OverlayButton)`
  top: 0;
  left: 0;
`;

export const ImageList = () => {
  const [rowsPerPage, setRowsPerPage] = React.useState(3);
  const [page, setPage] = React.useState(1);
  const images = useAppSelector(selectImages);
  const { width: viewWidth, height: viewHeight } = useViewDimensions();

  const imageHeight = viewHeight * (0.9 / rowsPerPage);
  const imagesPlusFetchButton = [
    ...images,
    `-${(2 / 3) * imageHeight}x${imageHeight}`,
  ];
  const gap = 4;

  const imagesPerPage = useMemo(() => {
    let currentRow = 0;
    let widthLeft = viewWidth;
    let imagesPerRow = [0];

    let currentPage = 0;
    let imagesPerPage = [0];

    for (const image of imagesPlusFetchButton) {
      const { width, height } = extractImageSize(image);
      const imageWidth = (width / height) * imageHeight;
      const nextWidthLeft = widthLeft - imageWidth - gap;
      if (nextWidthLeft >= 0) {
        imagesPerRow[currentRow]++;
        imagesPerPage[currentPage]++;
        widthLeft = nextWidthLeft;
        continue;
      }

      currentRow++;
      imagesPerRow[currentRow] = 1;
      widthLeft = viewWidth - imageWidth - gap;

      // 3 rows per page
      if (currentRow % rowsPerPage === 0) {
        currentPage++;
        imagesPerPage[currentPage] = 1;
      } else {
        imagesPerPage[currentPage]++;
      }
    }

    return imagesPerPage;
  }, [images.length, viewWidth, imageHeight, rowsPerPage]);

  useEffect(() => {
    if (page > imagesPerPage.length) {
      setPage(imagesPerPage.length);
    }
  }, [imagesPerPage]);

  const displayedImages = useMemo(() => {
    const startIndex = imagesPerPage
      .slice(0, page - 1)
      .reduce((a, b) => a + b, 0);
    const endIndex = startIndex + imagesPerPage[page - 1];
    return images.slice(startIndex, endIndex);
  }, [images.length, imagesPerPage, page, rowsPerPage]);

  const handleZoom = (direction: 'in' | 'out') => () => {
    // min 1 row, max 7 rows
    if (direction === 'out' && rowsPerPage < 7) {
      setRowsPerPage(rowsPerPage + 1);
    } else if (direction === 'in' && rowsPerPage > 1) {
      setRowsPerPage(rowsPerPage - 1);
    }
  };

  return (
    <>
      <ImageModal />
      <ImageListWrapper rowsPerPage={rowsPerPage}>
        <ImageListFlex>
          {displayedImages.map((image, index) => (
            <ImageDataWrapper key={image} filename={image} arrayIdx={index}>
              {({ setSeed, handleDelete, openModal }) => (
                <ImageButtonsContainer
                  onClick={openModal}
                  rowsPerPage={rowsPerPage}
                >
                  <StyledImage
                    src={prefixWithImageUrl(image)}
                    rowsPerPage={rowsPerPage}
                  />
                  <Tooltip title={'Set seed from image'}>
                    <SetSeedButton
                      onClick={(e) => {
                        e.stopPropagation();
                        setSeed();
                      }}
                    >
                      <SeedIcon />
                    </SetSeedButton>
                  </Tooltip>
                  <Tooltip title={'Delete image'}>
                    <DeleteButton
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete();
                      }}
                    >
                      <DeleteOutlinedIcon />
                    </DeleteButton>
                  </Tooltip>
                </ImageButtonsContainer>
              )}
            </ImageDataWrapper>
          ))}
          {page === imagesPerPage.length ? (
            <FetchImagesButton rowsPerPage={rowsPerPage} />
          ) : null}
        </ImageListFlex>
      </ImageListWrapper>
      <Box
        position="relative"
        width="100%"
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
      >
        <Box position="absolute" top="0" right="0">
          <ButtonGroup
            size="small"
            variant="outlined"
            color="inherit"
            sx={{ opacity: '30%' }}
          >
            <Button onClick={handleZoom('out')}>
              <ZoomOutIcon />
            </Button>
            <Button onClick={handleZoom('in')}>
              <ZoomInIcon />
            </Button>
          </ButtonGroup>
        </Box>
        <Box width="100%" display="flex" justifyContent="center" gap="1rem">
          <Pagination
            count={imagesPerPage.length}
            variant="outlined"
            shape="rounded"
            page={page}
            onChange={(_, value) => setPage(value)}
          />
        </Box>
      </Box>
    </>
  );
};
