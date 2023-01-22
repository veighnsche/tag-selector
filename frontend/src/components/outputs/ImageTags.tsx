import styled from '@emotion/styled'
import { Chip } from '@mui/material'
import { MouseEvent } from 'react'
import { useAppDispatch, useAppSelector } from '../../store'
import { moveTagBetweenLocations, newTag, selectGetId, selectLocateTagByName } from '../../store/reducers/tags'

interface ImageTagsProps {
  tags?: string[]
}

const TagContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  gap: 0.25rem;
  padding: 0.5rem;
`

export const ImageTags = ({ tags = [] }: ImageTagsProps) => {
  const locateTag = useAppSelector(selectLocateTagByName)
  const getId = useAppSelector(selectGetId)
  const dispatch = useAppDispatch()

  return (
    <TagContainer>
      {tags.map((tag) => {
        const {
          isTags,
          isNegativeTags,
          isTagPool,
          found,
        } = locateTag(tag)

        function handleLeftClick() {
          if (!found) {
            dispatch(newTag({ name: tag, location: 'tagPool' }))
            return
          }
          dispatch(moveTagBetweenLocations({
            id: getId(tag) as string,
            to: isTagPool ? 'tags' : isTags ? 'negativeTags' : 'tagPool',
          }))
        }

        return (
          <Chip
            size="small"
            key={tag}
            label={tag}
            variant={found ? 'filled' : 'outlined'}
            color={isTags ? 'primary' : isNegativeTags ? 'secondary' : 'default'}
            onClick={handleLeftClick}
          />
        )
      })}
    </TagContainer>
  )
}