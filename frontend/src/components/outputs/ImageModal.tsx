import styled from '@emotion/styled'
import { Backdrop } from '@mui/material'
import { useEffect, useState } from 'react'
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

enum ModelStatus {
  CLOSED = 'CLOSED',
  CLOSING = 'CLOSING',
  OPEN = 'OPEN',
}

const ImageContainer = styled.div`
  position: relative;
`

const StyledImage = styled.img`
  height: 95vh;
  width: 95vw;
  object-fit: contain;

  display: block;
  backface-visibility: hidden;
`

const OverlayBottomRight = styled.div`
  cursor: pointer;
  position: absolute;
  bottom: 0;
  right: 0;
  width: 50%;
  height: 50%;
`

const OverlayBottomLeft = styled.div`
  cursor: pointer;
  position: absolute;
  bottom: 0;
  left: 0;
  width: 50%;
  height: 50%;
`

export const ImageModal = () => {
  const modalImage = useAppSelector(selectModalImage)
  const isLastImage = useAppSelector(selectIsLastImage)
  const [status, setStatus] = useState<ModelStatus>(ModelStatus.CLOSED)
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null)
  const dispatch = useAppDispatch()
  const emit = useEmitters()
  const socket = useSocket()

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
    }, 1000))
  }

  function handleNext() {
    if (!isLastImage) {
      dispatch(nextModalImage())
    } else if (modalImage) {
      socket.on(SocketEvent.FETCH_IMAGES, ({ images }: { images: string[] }) => {
        if (images.length > 0) {
          dispatch(setModalImage(images[0]))
        }
        socket.off(SocketEvent.FETCH_IMAGES)
      })
      // todo: toIndex should be the filename
      emit.fetchImages({ amount: 10, toIndex: extractFileIndex(modalImage) })
    }
  }

  function handlePrevious() {
    dispatch(previousModalImage())
  }

  return (
    <Backdrop
      open={status === ModelStatus.OPEN}
      onClick={handleClose}
      sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
    >
      {modalImage ? (
        <ImageContainer>
          <StyledImage
            src={prefixWithImageUrl(modalImage!)}
            alt="modal"
          />
          <OverlayBottomRight onClick={(e) => {
            e.stopPropagation()
            handleNext()
          }}/>
          <OverlayBottomLeft onClick={(e) => {
            e.stopPropagation()
            handlePrevious()
          }}/>
        </ImageContainer>
      ): null}
    </Backdrop>
  )
}
