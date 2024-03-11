import styled from '@emotion/styled';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import { Backdrop, IconButton, Tooltip } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useEmitters } from '../../hooks/useEmitters';
import { useModalNavigation } from '../../hooks/useModalNavigation';
import { useAppDispatch, useAppSelector } from '../../store';
import {
  nextModalImage,
  previousModalImage,
  removeImage,
  selectArrayIdx,
  selectIsLastImage,
  selectIsModalOpen,
  selectModalImage,
  toggleModal,
} from '../../store/reducers/images';
import { prefixWithImageUrl } from '../../utils/files';
import { ImageData } from './ImageData';

const ImageContainer = styled.div`
  width: 100vw;
  height: 100vh;
  position: relative;

  display: flex;
  justify-content: center;
  align-items: center;
`;

const StyledImage = styled.img<{
  isInfoOpen: boolean;
}>`
  grid-area: image;

  height: 100vh;
  max-width: ${({ isInfoOpen }) => (isInfoOpen ? '70vw' : '100vw')};
  object-fit: contain;

  display: block;
  backface-visibility: hidden;

  transition: max-width 0.8s ease-in-out;
`;

const OverlayBottomRight = styled.div`
  cursor: pointer;
  position: absolute;
  bottom: 0;
  right: 0;
  width: 33%;
  height: 33%;
`;

const OverlayBottomLeft = styled.div`
  cursor: pointer;
  position: absolute;
  bottom: 0;
  left: 0;
  width: 33%;
  height: 33%;
`;

const ImageDataFlex = styled.div`
  display: flex;
  justify-content: center;
`;

const ImageButtonsContainer = styled.div`
  position: relative;
  cursor: pointer;

  &:hover button {
    opacity: 0.5;
  }
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

export const ImageModal = () => {
  const modalImage = useAppSelector(selectModalImage);
  const isModalOpen = useAppSelector(selectIsModalOpen);
  const isLastImage = useAppSelector(selectIsLastImage);
  const dispatch = useAppDispatch();
  const emit = useEmitters();
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const getArrayIdx = useAppSelector(selectArrayIdx);
  const { navigateNext, navigatePrevious } = useModalNavigation();

  useEffect(() => {
    if (isModalOpen && modalImage) {
      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          handleClose();
        }
        if (event.key === 'ArrowRight') {
          navigateNext();
        }
        if (event.key === 'ArrowLeft') {
          navigatePrevious();
        }
      };

      window.addEventListener('keydown', handleKeyDown);
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [isLastImage, modalImage, isModalOpen]);

  function handleClose() {
    dispatch(toggleModal());
  }

  function handleDelete() {
    if (modalImage) {
      emit.removeImage(modalImage);

      if (isLastImage) {
        dispatch(previousModalImage());
      } else {
        dispatch(nextModalImage());
      }

      const arrayIdx = getArrayIdx(modalImage);
      dispatch(removeImage(arrayIdx));
    }
  }

  return (
    <Backdrop
      open={isModalOpen}
      onClick={handleClose}
      sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
    >
      <ImageContainer>
        {modalImage ? (
          <ImageDataFlex>
            <ImageData filename={modalImage!} open={isInfoOpen} />
            <ImageButtonsContainer
              onClick={(e) => {
                e.stopPropagation();
                setIsInfoOpen(!isInfoOpen);
              }}
            >
              <StyledImage
                isInfoOpen={isInfoOpen}
                src={prefixWithImageUrl(modalImage!)}
              />
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
          </ImageDataFlex>
        ) : null}
        {isInfoOpen ? null : (
          <>
            <OverlayBottomRight
              onClick={(e) => {
                e.stopPropagation();
                navigateNext();
              }}
            />
            <OverlayBottomLeft
              onClick={(e) => {
                e.stopPropagation();
                navigatePrevious();
              }}
            />
          </>
        )}
      </ImageContainer>
    </Backdrop>
  );
};
