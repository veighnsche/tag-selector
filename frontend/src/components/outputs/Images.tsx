import styled from '@emotion/styled'
import CasinoIcon from '@mui/icons-material/Casino'
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined'
import { IconButton, Tooltip } from '@mui/material'
import React from 'react'
import { useAppSelector } from '../../store'
import { selectImages } from '../../store/reducers/images'
import { prefixWithImageUrl } from '../../utils/files'
import { ImageDataWrapper } from './ImageDataWrapper'
import { ImageModal } from './ImageModal'

const ImageListWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 1rem;
`

const ImageContainer = styled.div`
  position: relative;
  cursor: pointer;

  &:hover button {
    opacity: 0.5;
  }
`

const StyledImage = styled.img`
  max-height: 32vh;

  display: block;
  backface-visibility: hidden;
`

const OverlayButton = styled(IconButton)`
  position: absolute;

  color: white;
  font-size: 1.5rem;
  opacity: 0;
  transition: all 0.2s ease-in-out;

  &:hover {
    opacity: 1 !important;
  }
`

const DeleteButton = styled(OverlayButton)`
  top: 0;
  right: 0;

  &:hover {
    color: red;
  }
`

const SetSeedButton = styled(OverlayButton)`
  top: 0;
  left: 0;
`

export const Images = () => {
  const images = useAppSelector(selectImages)

  return (
    <>
      <ImageModal/>
      <ImageListWrapper>
        {images.map((image, index) => (
          <ImageDataWrapper key={image} filename={image} arrayIdx={index}>
            {({ setSeed, handleDelete, openModal }) => (
              <ImageContainer onClick={openModal}>
                <StyledImage src={prefixWithImageUrl(image)} alt={image}/>
                <Tooltip title={'Set seed from image'}>
                  <SetSeedButton onClick={(e) => {
                    e.stopPropagation()
                    setSeed()
                  }}>
                    <CasinoIcon/>
                  </SetSeedButton>
                </Tooltip>
                <Tooltip title={'Delete image'}>
                  <DeleteButton onClick={(e) => {
                    e.stopPropagation()
                    handleDelete(index, image)
                  }}>
                    <DeleteOutlinedIcon/>
                  </DeleteButton>
                </Tooltip>
              </ImageContainer>
            )}
          </ImageDataWrapper>
        ))}
      </ImageListWrapper>
    </>
  )
}
