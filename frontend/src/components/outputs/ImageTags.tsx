import styled from '@emotion/styled'
import { Chip } from '@mui/material'
import { MouseEvent } from 'react'
import { useAppDispatch, useAppSelector } from '../../store'
import { moveTagBetweenLocations, newTag, selectGetId, selectLocateTag } from '../../store/reducers/tags'

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
  const locateTag = useAppSelector(selectLocateTag)
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

        /**
         * on left click:
         *   if tag is not found:
         *     add tag to tagPool
         *   if tag is in tagPool:
         *     move from tagPool to tags
         *   if tag is in tags:
         *     move from tags to tagPool
         *   if tag is in negativeTags:
         *     move from negativeTags to tags
         *
         * on right click:
         *   if tag is not found:
         *     do nothing
         *   if tag is in tagPool:
         *     move from tagPool to negativeTags
         *   if tag is in tags:
         *     move from tags to negativeTags
         *   if tag is in negativeTags:
         *     move from negativeTags to tagPool
         */

        function handleLeftClick() {
          if (!found) {
            dispatch(newTag({ name: tag, location: 'tagPool' }))
            return
          }
          dispatch(moveTagBetweenLocations({
            id: getId(tag) as string,
            to: isTagPool || isNegativeTags
              ? 'tags'
              : 'tagPool'
          }))
        }

        function handleRightClick(e: MouseEvent<HTMLDivElement>) {
          if (found) {
            e.preventDefault()
            dispatch(moveTagBetweenLocations({
              id: getId(tag) as string,
              to: isTagPool || isTags
                ? 'negativeTags'
                : 'tagPool'
            }))
          }
        }

        return (
          <Chip
            size="small"
            key={tag}
            label={tag}
            variant={found ? 'filled' : 'outlined'}
            color={isTags ? 'primary' : isNegativeTags ? 'secondary' : 'default'}
            onClick={handleLeftClick}
            onContextMenu={handleRightClick}
          />
        )
      })}
    </TagContainer>
  )
}