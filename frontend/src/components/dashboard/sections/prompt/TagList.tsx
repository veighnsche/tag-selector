import styled from '@emotion/styled'
import { Paper } from '@mui/material'
import { useRef } from 'react'
import { useDrop } from 'react-dnd'
import { RootState, useAppDispatch, useAppSelector } from '../../../../store'
import { moveTagBetweenLocations, selectNegativeTags, selectTagPool, selectTags } from '../../../../store/reducers/tags'
import { TagType } from '../../../../types'
import { PromptTagsType } from '../../../../types/image-input'
import { Tag } from './Tag'

const StyledPaper = styled(Paper)`
  padding: 0.5rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
`

const selectMap: Record<keyof PromptTagsType, (state: RootState) => TagType[]> = {
  tags: selectTags,
  negativeTags: selectNegativeTags,
  tagPool: selectTagPool,
}

interface TagPaperProps {
  location: keyof PromptTagsType
}

export const TagList = ({ location }: TagPaperProps) => {
  const tags = useAppSelector(selectMap[location])
  const ref = useRef<HTMLDivElement>(null)
  const dispatch = useAppDispatch()

  const [{ isOver }, drop] = useDrop({
    accept: 'tag',
    drop: (item: { name: string }, monitor) => {
      const didDrop = monitor.didDrop()
      if (didDrop) {
        return
      }
      dispatch(moveTagBetweenLocations({
        name: item.name,
        to: location,
      }))
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  })

  drop(ref)

  return (
    <div ref={ref}>
      <StyledPaper elevation={isOver ? 4 : 2}>
        {tags.map((tag, idx) => (
          <Tag
            key={tag.name}
            location={location}
            tag={tag}
            arrayIdx={idx}
          />
        ))}
      </StyledPaper>
    </div>
  )
}