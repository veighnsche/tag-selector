import JoinFullIcon from '@mui/icons-material/JoinFull'
import JoinInnerIcon from '@mui/icons-material/JoinInner'
import SendOutlined from '@mui/icons-material/SendOutlined'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import {
  Box,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Popover,
  Tooltip,
} from '@mui/material'
import React, { ComponentProps, useEffect, useState } from 'react'
import { useAppDispatch } from '../../../../store'
import { newTags } from '../../../../store/reducers/tags'
import { PromptTagsType } from '../../../../types/image-input'

const formControlColorMap: Record<keyof PromptTagsType, ComponentProps<typeof FormControl>['color']> = {
  tags: 'primary',
  negativeTags: 'secondary',
  tagPool: 'primary',
}

interface TagAddMenuProps {
  isOpen: boolean
  onClose: () => void
  anchorEl: HTMLElement | null
  location: keyof PromptTagsType
}

export const TagAddMenu = ({ isOpen, onClose, anchorEl, location }: TagAddMenuProps) => {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [value, setValue] = useState<string>('')
  const dispatch = useAppDispatch()
  const [doNotSeparate, setDoNotSeparate] = useState(false)
  const [addAsHidden, setAddAsHidden] = useState(false)

  function handleAdd() {
    const tags = value.split(',').map((tag) => tag.trim())
    dispatch(newTags({ names: tags, location }))
  }

  function handleClose() {
    setAddAsHidden(false)
    setDoNotSeparate(false)
    setValue('')
    onClose()
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
      onClose={() => {
        onClose()
      }}
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
    >
      <Box width="40rem" p={1}>
        <FormControl
          variant="outlined"
          fullWidth
          size="small"
          color={formControlColorMap[location]}
        >
          <InputLabel>{doNotSeparate ? 'Add single tag' : 'Add comma separated tags'}</InputLabel>
          <OutlinedInput
            inputRef={inputRef}
            label={doNotSeparate ? 'Add single tag' : 'Add comma separated tags'}
            value={value}
            onChange={(e) => {
              setValue(e.target.value)
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleAdd()
                handleClose()
              }
              if (e.key === 'Escape') {
                handleClose()
              }
            }}
            endAdornment={
              <InputAdornment position="end">
                <Tooltip title={doNotSeparate ? 'Separate tags' : 'Do not separate tags'}>
                  <IconButton
                    edge="end"
                    onClick={() => {
                      setDoNotSeparate(!doNotSeparate)
                    }}
                  >
                    {doNotSeparate ? <JoinFullIcon/> : <JoinInnerIcon/>}
                  </IconButton>
                </Tooltip>
                <Tooltip title={addAsHidden ? 'Add as visible' : 'Add as hidden'}>
                  <IconButton
                    edge="end"
                    onClick={() => {
                      setAddAsHidden(!addAsHidden)
                    }}
                  >
                    {addAsHidden ? <VisibilityOffIcon/> : <VisibilityIcon/>}
                  </IconButton>
                </Tooltip>
                <Tooltip title={`Add to ${location}`}>
                  <IconButton edge="end" onClick={() => {
                    handleAdd()
                    handleClose()
                  }}>
                    <SendOutlined/>
                  </IconButton>
                </Tooltip>
              </InputAdornment>
            }
          />
        </FormControl>
      </Box>
    </Popover>
  )
}
