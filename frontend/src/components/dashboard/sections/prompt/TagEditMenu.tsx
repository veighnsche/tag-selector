import { SendOutlined } from '@mui/icons-material';
import ReplayIcon from '@mui/icons-material/Replay';
import {
  Box,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Popover,
  TextField,
} from '@mui/material';
import React, { ComponentProps, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../store';
import { editTag, selectLocateTag } from '../../../../store/reducers/tags';
import { TagType } from '../../../../types';
import { PromptTagsType } from '../../../../types/image-input';
import { makeTagLabelWrapped } from '../../../../utils/tags';
import { buttonColorMap } from './maps';
import { VolumeControl } from './VolumeControl';

const inputColorMap: Record<keyof PromptTagsType, ComponentProps<typeof TextField>['color']> = {
  tags: 'primary',
  negativeTags: 'secondary',
  tagPool: undefined,
};

interface TagEditMenuProps {
  isOpen: boolean;
  handleClose: () => void;
  anchorEl: HTMLElement | null;
  tag: TagType;
}

export const TagEditMenu = ({ isOpen, handleClose, anchorEl, tag }: TagEditMenuProps) => {
  const tagPrompt = makeTagLabelWrapped(tag);

  const inputRef = React.useRef<HTMLInputElement>(null);
  const [value, setValue] = useState<string>(tagPrompt);
  const dispatch = useAppDispatch();
  const location = useAppSelector(selectLocateTag)(tag.id);
  const inputColor = inputColorMap[location];

  function handleEdit() {
    dispatch(editTag({ id: tag.id, name: value }));
    handleClose();
  }

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    }
  }, [isOpen]);

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
      <Box width="20rem" p={1} display="flex" flexDirection="column" gap={1}>
        <FormControl variant="outlined" fullWidth size="small" color={inputColor}>
          <InputLabel>{tagPrompt}</InputLabel>
          <OutlinedInput
            inputRef={inputRef}
            label={tagPrompt}
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleEdit();
              }
            }}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  edge="end"
                  onClick={() => {
                    setValue(tagPrompt);
                  }}
                  color={buttonColorMap[location]}
                  disabled={value === tagPrompt}
                >
                  <ReplayIcon />
                </IconButton>
                <IconButton edge="end" onClick={handleEdit} color={buttonColorMap[location]}>
                  <SendOutlined />
                </IconButton>
              </InputAdornment>
            }
          />
        </FormControl>
        <VolumeControl location={location} tag={tag} />
      </Box>
    </Popover>
  );
};
