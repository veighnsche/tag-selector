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
} from '@mui/material'
import React, { ComponentProps, useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../../../store'
import {
  decreaseTagStrength,
  editTag,
  increaseTagStrength,
  selectLocateTag,
  toggleMuteTag,
} from '../../../../store/reducers/tags'
import { TagType } from '../../../../types'
import { PromptTagsType } from '../../../../types/image-input'
import { makeTagLabelWrapped } from '../../../../utils/tags'

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
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [value, setValue] = useState<string>(makeTagLabelWrapped(tag))
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
      <Box width="15rem" p={1} display="flex" flexDirection="column" gap={1}>
        <FormControl variant="outlined" fullWidth size="small" color={inputColor}>
          <InputLabel>{tag.name}</InputLabel>
          <OutlinedInput
            inputRef={inputRef}
            label={tag.name}
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
                    setValue(tag.name)
                  }}
                  color={buttonColorMap[location]}
                  disabled={value === tag.name}
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
          <Button
            variant={tag.muted ? 'contained' : 'outlined'}
            onClick={() => {
              dispatch(toggleMuteTag({ id: tag.id, location }))
            }}
          >
            <VolumeMuteIcon/>
          </Button>
          <Button onClick={() => {
            dispatch(decreaseTagStrength({ id: tag.id, location }))
          }}>
            <VolumeDownIcon/>
          </Button>
          <Button onClick={() => {
            dispatch(increaseTagStrength({ id: tag.id, location }))
          }}>
            <VolumeUpIcon/>
          </Button>
        </ButtonGroup>
      </Box>
    </Popover>
  )
}
