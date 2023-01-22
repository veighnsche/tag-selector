import { Chip } from '@mui/material'
import { useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../store'
import { moveTagBetweenLocations, newTag, selectGetId, selectLocateTagByName } from '../../store/reducers/tags'
import { ClipRetrievalPopover } from '../clipRetrieval/ClipRetrievalPopover'

export const ImageTag = ({ tag }: { tag: string }) => {
  const locateTag = useAppSelector(selectLocateTagByName)
  const getId = useAppSelector(selectGetId)
  const dispatch = useAppDispatch()
  const [clipAnchorEl, setClipAnchorEl] = useState<HTMLElement | null>(null)
  const isClipOpen = Boolean(clipAnchorEl)

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
    <>
      <Chip
        size="small"
        key={tag}
        label={tag}
        variant={found ? 'filled' : 'outlined'}
        color={isTags ? 'primary' : isNegativeTags ? 'secondary' : 'default'}
        onClick={handleLeftClick}
        onContextMenu={(e) => {
          e.preventDefault()
          setClipAnchorEl(e.currentTarget)
        }}
      />
      <ClipRetrievalPopover
        anchorEl={clipAnchorEl}
        handleClose={() => setClipAnchorEl(null)}
        isOpen={isClipOpen}
        prompt={tag}
      />
    </>
  )
}