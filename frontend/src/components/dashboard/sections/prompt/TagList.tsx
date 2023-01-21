import { Box, Chip, Paper, Typography } from '@mui/material'
import { MouseEvent, ReactNode, useRef, useState } from 'react'
import { useDrop } from 'react-dnd'
import { RootState, useAppDispatch, useAppSelector } from '../../../../store'
import { moveTagBetweenLocations, selectNegativeTags, selectTagPool, selectTags } from '../../../../store/reducers/tags'
import { setIsDragging } from '../../../../store/reducers/tagsState'
import { TagType } from '../../../../types'
import { PromptTagsType } from '../../../../types/image-input'
import { Tag } from './Tag'
import { TagAddMenu } from './TagAddMenu'

const selectMap: Record<keyof PromptTagsType, (state: RootState) => TagType[]> = {
  tags: selectTags,
  negativeTags: selectNegativeTags,
  tagPool: selectTagPool,
}

const displayMap: Record<keyof PromptTagsType, ReactNode> = {
  tags: 'Tags',
  negativeTags: 'Negative Tags',
  tagPool: (
    <>
      Tag Pool
      <span style={{ opacity: 0.5, fontSize: '0.75rem' }}> (unused in prompt)</span>
    </>
  ),
}

const colorMap: Record<keyof PromptTagsType, 'primary' | 'secondary' | 'default'> = {
  tags: 'primary',
  negativeTags: 'secondary',
  tagPool: 'default',
}

interface TagPaperProps {
  location: keyof PromptTagsType
}

export const TagList = ({ location }: TagPaperProps) => {
  const tags = useAppSelector(selectMap[location])
  const dispatch = useAppDispatch()
  const dropRef = useRef<HTMLDivElement>(null)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const isOpen = Boolean(anchorEl)

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  const [{ isOver }, drop] = useDrop({
    accept: 'tag',
    drop: (item: { id: string }, monitor) => {
      const didDrop = monitor.didDrop()
      if (didDrop) {
        return
      }
      dispatch(moveTagBetweenLocations({
        id: item.id,
        to: location,
      }))
      dispatch(setIsDragging(false))
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  })

  drop(dropRef)

  return (
    <Box ref={dropRef}>
      <Paper elevation={isOver ? 4 : 2} sx={{ minHeight: '48px', p: '0.5rem' }} square>
        <Typography variant="caption" sx={{ ml: '1rem', opacity: 0.5 }} color={colorMap[location]}>
          {displayMap[location]}
        </Typography>
        <Box display="flex" flexWrap="wrap" gap="0.25rem">
          {location === 'tagPool' ? (
            <>
              <Chip label="add" onClick={handleClick}/>
              <TagAddMenu isOpen={isOpen} anchorEl={anchorEl} handleClose={handleClose}/>
            </>
          ) : null}
          {tags.map((tag, idx) => (
            <Tag
              key={tag.id}
              location={location}
              tag={tag}
              arrayIdx={idx}
            />
          ))}
        </Box>
      </Paper>
    </Box>
  )
}