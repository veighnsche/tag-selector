import styled from '@emotion/styled'
import { Backdrop } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useEmitters } from '../../hooks/useEmitters'
import { useAppDispatch, useAppSelector } from '../../store'
import {
  nextModalImage,
  previousModalImage,
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

  height: 95vh;
  max-width: ${({ isInfoOpen }) => (isInfoOpen ? '75vw' : '95vw')};
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

const OverlayTopLeft = styled.div`
  cursor: pointer;
  position: absolute;
  top: 0;
  left: 0;
  width: 33%;
  height: 33%;
`


const ImageDataFlex = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
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
            <StyledImage
              isInfoOpen={isInfoOpen}
              src={prefixWithImageUrl(modalImage!)}
              alt="modal"
            />
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
        {!isInfoOpen ? (
          <OverlayTopLeft onClick={(e) => {
            e.stopPropagation()
            setIsInfoOpen(!isInfoOpen)
          }}/>
        ) : null}
      </ImageContainer>
    </Backdrop>
  )
}
