import { SendOutlined } from '@mui/icons-material'
import ReplayIcon from '@mui/icons-material/Replay'
import VolumeDownIcon from '@mui/icons-material/VolumeDown'
import VolumeMuteIcon from '@mui/icons-material/VolumeMute'
import VolumeUpIcon from '@mui/icons-material/VolumeUp'
import {
  Box,
  Button,
  ButtonGroup,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Popover,
  TextField,
  Tooltip,
} from '@mui/material'
import React, { ComponentProps, useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../../../store'
import {
  decreaseTagStrength,
  editTag,
  increaseTagStrength,
  selectLocateTag, toggleHideTag,
  toggleMuteTag,
} from '../../../../store/reducers/tags'
import { TagType } from '../../../../types'
import { PromptTagsType } from '../../../../types/image-input'
import { makeTagLabelWrapped } from '../../../../utils/tags'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'

const inputColorMap: Record<keyof PromptTagsType, ComponentProps<typeof TextField>['color']> = {
  tags: 'primary',
  negativeTags: 'secondary',
  tagPool: undefined,
}

const buttonColorMap: Record<keyof PromptTagsType, ComponentProps<typeof Button>['color']> = {
  tags: 'primary',
  negativeTags: 'secondary',
  tagPool: 'inherit',
}

interface TagAddMenuProps {
  isOpen: boolean
  handleClose: () => void
  anchorEl: HTMLElement | null
  tag: TagType
}

export const TagEditMenu = ({ isOpen, handleClose, anchorEl, tag }: TagAddMenuProps) => {
  const tagPrompt = makeTagLabelWrapped(tag)

  const inputRef = React.useRef<HTMLInputElement>(null)
  const [value, setValue] = useState<string>(tagPrompt)
  const dispatch = useAppDispatch()
  const location = useAppSelector(selectLocateTag)(tag.id)
  const inputColor = inputColorMap[location]

  function handleEdit() {
    dispatch(editTag({ id: tag.id, name: value }))
    handleClose()
  }

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus()
      }, 0)
    }
  }, [isOpen])

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
              setValue(e.target.value)
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleEdit()
              }
            }}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  edge="end"
                  onClick={() => {
                    setValue(tagPrompt)
                  }}
                  color={buttonColorMap[location]}
                  disabled={value === tagPrompt}
                >
                  <ReplayIcon/>
                </IconButton>
                <IconButton edge="end" onClick={handleEdit} color={buttonColorMap[location]}>
                  <SendOutlined/>
                </IconButton>
              </InputAdornment>
            }
          />
        </FormControl>
        <ButtonGroup fullWidth color={buttonColorMap[location]}>
          <Tooltip title={'Hiding will add this tag to the prompt, but will not show it'}>
            <Button
              variant={tag.hidden ? 'contained' : 'outlined'}
              onClick={() => {
                dispatch(toggleHideTag({ id: tag.id, location }))
              }}
            >
              {tag.hidden ? <VisibilityOffIcon/> : <VisibilityIcon/>}
            </Button>
          </Tooltip>
          <Tooltip title={'Muting will prevent this tag from being added to the prompt'}>
            <Button
              variant={tag.muted ? 'contained' : 'outlined'}
              onClick={() => {
                dispatch(toggleMuteTag({ id: tag.id, location }))
              }}
            >
              <VolumeMuteIcon/>
            </Button>
          </Tooltip>
          <Tooltip title={'add 0.1 to strength'}>
            <Button onClick={() => {
              dispatch(decreaseTagStrength({ id: tag.id, location }))
            }}>
              <VolumeDownIcon/>
            </Button>
          </Tooltip>
          <Tooltip title={'subtract 0.1 from strength'}>
            <Button onClick={() => {
              dispatch(increaseTagStrength({ id: tag.id, location }))
            }}>
              <VolumeUpIcon/>
            </Button>
          </Tooltip>
        </ButtonGroup>
      </Box>
    </Popover>
  )
}
