import styled from '@emotion/styled'
import { Box, Popover, Typography } from '@mui/material'
import { useEffect, useRef, useState } from 'react'
import { fetchClipRetrieval } from './api'
import { ClipType } from './type'

interface ClipRetrievalPopoverProps {
  anchorEl: HTMLElement | null
  handleClose: () => void
  isOpen: boolean
  prompt: string
}

const StyledImage = styled.img`
  display: none;
  height: 100%;
  width: auto;
`

export const ClipRetrievalPopover = ({
  anchorEl,
  handleClose,
  isOpen,
  prompt,
}: ClipRetrievalPopoverProps) => {
  const [clips, setClips] = useState<ClipType[]>([])
  const boxRef = useRef<HTMLDivElement>(null)
  const [loadedAmount, setLoadedAmount] = useState(0)

  useEffect(() => {
    if (isOpen && clips.length === 0) {
      fetchClipRetrieval({ prompt })
      .then((clips) => {
        setClips(clips)
      })
    }
  }, [isOpen])

  useEffect(() => {
    // automatically scroll from left to right
    // duration of 10 seconds
    if (!isOpen || !boxRef.current) return
    const box = boxRef.current
    const interval = setInterval(() => {
      box.scrollLeft += 1
      if (box.scrollLeft >= box.scrollWidth - box.clientWidth) {
        clearInterval(interval)
      }
    }, 10000 / box.scrollWidth)

    return () => {
      clearInterval(interval)
    }
  }, [isOpen, boxRef.current, loadedAmount])

  return (
    <Popover
      open={isOpen}
      anchorEl={anchorEl}
      onClose={handleClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
    >
      <Typography variant="h6" align="center">
        {prompt}
      </Typography>
      <Box
        height="33vh"
        width="100%"
        display="flex"
        flexWrap="nowrap"
        overflow="auto"
        ref={boxRef}
      >
        {clips.map((clip) => (
          <StyledImage
            src={clip.url}
            alt={clip.caption}
            key={clip.url}
            onLoad={(e) => {
              e.currentTarget.style.display = 'block'
              setLoadedAmount((prev) => prev + 1)
            }}
          />
        ))}
      </Box>
    </Popover>
  )
}