import styled from '@emotion/styled'
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined'
import InfoIcon from '@mui/icons-material/Info'
import { Backdrop, IconButton, Tooltip } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useEmitters } from '../../hooks/useEmitters'
import { useAppDispatch, useAppSelector } from '../../store'
import {
  nextModalImage,
  previousModalImage,
  removeImage, selectArrayIdx,
  selectIsLastImage,
  selectModalImage,
  setModalImage,
} from '../../store/reducers/images'
import { SocketEvent } from '../../types'
import { extractFileIndex, prefixWithImageUrl } from '../../utils/files'
import { useSocket } from '../providers/SocketProvider'
import { ImageData } from './ImageData'

enum ModelStatus {
  CLOSED = 'CLOSED',
  CLOSING = 'CLOSING',
  OPEN = 'OPEN',
}

const ImageContainer = styled.div`
  width: 100vw;
  height: 100vh;
  position: relative;
  
  display: flex;
  justify-content: center;
  align-items: center;
`

const StyledImage = styled.img<{
  isInfoOpen: boolean
}>`
  grid-area: image;

  height: 100vh;
  max-width: ${({ isInfoOpen }) => (isInfoOpen ? '80vw' : '100vw')};
  object-fit: contain;

  display: block;
  backface-visibility: hidden;
  
  transition: max-width 0.8s ease-in-out;
`

const OverlayBottomRight = styled.div`
  cursor: pointer;
  position: absolute;
  bottom: 0;
  right: 0;
  width: 33%;
  height: 33%;
`

const OverlayBottomLeft = styled.div`
  cursor: pointer;
  position: absolute;
  bottom: 0;
  left: 0;
  width: 33%;
  height: 33%;
`

const ImageDataFlex = styled.div`
  display: flex;
  justify-content: center;
`

const ImageButtonsContainer = styled.div`
  position: relative;

  &:hover button {
    opacity: 0.5;
  }
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

const ShowInfoButton = styled(OverlayButton)`
  top: 0;
  left: 0;

  &:hover {
    color: blue;
  }
`

export const ImageModal = () => {
  const modalImage = useAppSelector(selectModalImage)
  const isLastImage = useAppSelector(selectIsLastImage)
  const [status, setStatus] = useState<ModelStatus>(ModelStatus.CLOSED)
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null)
  const dispatch = useAppDispatch()
  const emit = useEmitters()
  const socket = useSocket()
  const [isInfoOpen, setIsInfoOpen] = useState(false)
  const getArrayIdx = useAppSelector(selectArrayIdx)

  useEffect(() => {
    if (modalImage) {
      setStatus(ModelStatus.OPEN)
      if (timer) {
        clearTimeout(timer)
        setTimer(null)
      }
    } else {
      handleClose()
    }
  }, [modalImage])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleClose()
      }
      if (event.key === 'ArrowRight') {
        handleNext()
      }
      if (event.key === 'ArrowLeft') {
        handlePrevious()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isLastImage, modalImage, status])

  function handleClose() {
    // closing takes 1s, so we set the status to CLOSING
    // and then after 1s we set it to CLOSED
    setStatus(ModelStatus.CLOSING)
    setTimer(setTimeout(() => {
      setStatus(ModelStatus.CLOSED)
      dispatch(setModalImage(null))
      setTimer(null)
      // todo: replace magic number with time it takes for backdrop to close
    }, 1000))
  }

  function handleNext() {
    if (!isLastImage) {
      dispatch(nextModalImage())
    } else if (modalImage) {
      socket.on(SocketEvent.FETCH_IMAGES_MODAL, ({ nextImage }: { nextImage: string }) => {
        if (nextImage) {
          dispatch(setModalImage(nextImage))
        }
        socket.off(SocketEvent.FETCH_IMAGES_MODAL)
      })
      // todo: toIndex should be the filename
      emit.fetchImagesModal({ amount: 10, toIndex: extractFileIndex(modalImage) })
    }
  }

  function handlePrevious() {
    dispatch(previousModalImage())
  }

  function handleDelete() {
    if (modalImage) {
      emit.removeImage(modalImage)

      if (isLastImage) {
        dispatch(previousModalImage())
      } else {
        dispatch(nextModalImage())
      }

      const arrayIdx = getArrayIdx(modalImage)
      dispatch(removeImage(arrayIdx))
    }
  }

  return (
    <Backdrop
      open={status === ModelStatus.OPEN && modalImage !== null}
      onClick={handleClose}
      sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
    >
      <ImageContainer>
        {modalImage ? (
          <ImageDataFlex>
            <ImageData
              filename={modalImage!}
              open={isInfoOpen}
              onClose={() => {
                setIsInfoOpen(false)
              }}
            />
            <ImageButtonsContainer>
              <StyledImage
                isInfoOpen={isInfoOpen}
                src={prefixWithImageUrl(modalImage!)}
              />
              <Tooltip title={'Show info'}>
                <ShowInfoButton onClick={(e) => {
                  e.stopPropagation()
                  setIsInfoOpen(!isInfoOpen)
                }}>
                  <InfoIcon/>
                </ShowInfoButton>
              </Tooltip>
              <Tooltip title={'Delete image'}>
                <DeleteButton onClick={(e) => {
                  e.stopPropagation()
                  handleDelete()
                }}>
                  <DeleteOutlinedIcon/>
                </DeleteButton>
              </Tooltip>
            </ImageButtonsContainer>
          </ImageDataFlex>
        ) : null}
        <OverlayBottomRight onClick={(e) => {
          e.stopPropagation()
          handleNext()
        }}/>
        <OverlayBottomLeft onClick={(e) => {
          e.stopPropagation()
          handlePrevious()
        }}/>
      </ImageContainer>
    </Backdrop>
  )
}
