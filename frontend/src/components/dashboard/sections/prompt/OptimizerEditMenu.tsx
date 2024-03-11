import { Box, Popover } from '@mui/material';
import React from 'react';
import { useAppSelector } from '../../../../store';
import { selectLocateTag } from '../../../../store/reducers/tags';
import { TagType } from '../../../../types';
import { VolumeControl } from './VolumeControl';

interface OptimizerEditMenuProps {
  isOpen: boolean;
  handleClose: () => void;
  anchorEl: HTMLElement | null;
  tag: TagType;
}

export const OptimizerEditMenu = ({ isOpen, handleClose, anchorEl, tag }: OptimizerEditMenuProps) => {
  const location = useAppSelector(selectLocateTag)(tag.id);

  return (
    <Popover
      open={isOpen}
      onClose={handleClose}
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
    >
      <Box width="20rem" p={1}>
        <VolumeControl location={location} tag={tag} />
      </Box>
    </Popover>
  );
};
