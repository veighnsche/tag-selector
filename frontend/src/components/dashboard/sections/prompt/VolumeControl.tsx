import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VolumeDownIcon from '@mui/icons-material/VolumeDown';
import VolumeMuteIcon from '@mui/icons-material/VolumeMute';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import { Button, ButtonGroup, Tooltip } from '@mui/material';
import React from 'react';
import { useAppDispatch } from '../../../../store';
import {
  decreaseTagStrength,
  increaseTagStrength,
  toggleHideTag,
  toggleMuteTag,
} from '../../../../store/reducers/tags';
import { PromptTagsType, TagType } from '../../../../types/image-input';
import { buttonColorMap } from './maps';

interface VolumeControlProps {
  location: keyof PromptTagsType;
  tag: TagType;
}

export const VolumeControl = ({ location, tag }: VolumeControlProps) => {
  const dispatch = useAppDispatch();
  return (
    <ButtonGroup fullWidth color={buttonColorMap[location]}>
      <Tooltip title={'Hiding will add this tag to the prompt, but will not show it'}>
        <Button
          variant={tag.hidden ? 'contained' : 'outlined'}
          onClick={() => {
            dispatch(toggleHideTag({ id: tag.id, location }));
          }}
        >
          {tag.hidden ? <VisibilityOffIcon /> : <VisibilityIcon />}
        </Button>
      </Tooltip>
      <Tooltip title={'Muting will prevent this tag from being added to the prompt'}>
        <Button
          variant={tag.muted ? 'contained' : 'outlined'}
          onClick={() => {
            dispatch(toggleMuteTag({ id: tag.id, location }));
          }}
        >
          <VolumeMuteIcon />
        </Button>
      </Tooltip>
      <Tooltip title={'add 0.1 to strength'}>
        <Button
          onClick={() => {
            dispatch(decreaseTagStrength({ id: tag.id, location }));
          }}
        >
          <VolumeDownIcon />
        </Button>
      </Tooltip>
      <Tooltip title={'subtract 0.1 from strength'}>
        <Button
          onClick={() => {
            dispatch(increaseTagStrength({ id: tag.id, location }));
          }}
        >
          <VolumeUpIcon />
        </Button>
      </Tooltip>
    </ButtonGroup>
  );
};
