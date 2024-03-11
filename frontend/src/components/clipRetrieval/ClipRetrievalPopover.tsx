import { Box, Popover, Typography } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { fetchClipRetrieval } from './api';

interface ClipRetrievalPopoverProps {
  anchorEl: HTMLElement | null;
  handleClose: () => void;
  isOpen: boolean;
  prompt: string;
}

export const ClipRetrievalPopover = ({ anchorEl, handleClose, isOpen, prompt }: ClipRetrievalPopoverProps) => {
  const boxRef = useRef<HTMLDivElement>(null);
  const [images, setImages] = useState<HTMLImageElement[]>([]);

  useEffect(() => {
    if (isOpen && images.length === 0) {
      fetchClipRetrieval({ prompt }).then((clips) => {
        clips.forEach((clip) => {
          const img = new Image();
          img.src = clip.url;
          img.alt = clip.caption;
          img.onload = () => {
            setImages((prev) => [...prev, img]);
          };
          img.onerror = (e) => {
            if (e instanceof Event) {
              e.preventDefault();
            }
          };
        });
      });
    }
  }, [isOpen, prompt]);

  useEffect(() => {
    // automatically scroll from left to right
    // duration of 10 seconds
    if (!isOpen || !boxRef.current) return;
    const box = boxRef.current;
    const interval = setInterval(() => {
      box.scrollLeft += 1;
      if (box.scrollLeft >= box.scrollWidth - box.clientWidth) {
        clearInterval(interval);
      }
    }, 10000 / box.scrollWidth);

    return () => {
      clearInterval(interval);
    };
  }, [isOpen, images.length]);

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
      <Box height="30vh" width="100%" display="flex" flexWrap="nowrap" overflow="auto" ref={boxRef}>
        {images.map((img) => (
          <img key={img.src} src={img.src} alt={img.alt} style={{ width: 'auto', height: '100%' }} />
        ))}
      </Box>
    </Popover>
  );
};
