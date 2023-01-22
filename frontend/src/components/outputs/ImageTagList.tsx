import styled from '@emotion/styled'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import { Box, FormControlLabel, Paper, Switch, Tooltip, Typography } from '@mui/material'
import React, { useCallback, useMemo, useState } from 'react'
import { initialPromptTagsState } from '../../store/reducers/tags'
import { PromptTagsType, TagType } from '../../types/image-input'
import { ImageTag } from './ImageTag'

interface ImageTagsProps {
  tags?: string[]
  promptTags?: PromptTagsType
}

const TagContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  gap: 0.25rem;
  padding: 0.5rem;
`

export const ImageTagList = ({
  tags = [],
  promptTags = initialPromptTagsState,
}: ImageTagsProps) => {
  const [showAI, setShowAI] = useState(true)
  const [showPrompt, setShowPrompt] = useState(true)
  const [showNegative, setShowNegative] = useState(false)

  const hydratedTags: TagType[] = useMemo(() => {
    return tags.map((tag) => ({
      name: tag,
      id: '', // id is not used here
    }))
  }, [tags])

  const replaceTags = useCallback((tags: TagType[], location: keyof PromptTagsType) => {
    promptTags[location].forEach((tag) => {
      const index = tags.findIndex((t) => t.name === tag.name)
      if (index !== -1) {
        tags[index] = tag
      }
      else if (location === 'tags') {
        tags.unshift(tag)
      }
      else {
        tags.push(tag)
      }
    })
    return tags
  }, [promptTags])

  const viewTags = useMemo(() => {
    let tags: TagType[] = []
    if (showAI) {
      tags = [...tags, ...hydratedTags]
    }
    if (showPrompt) {
      tags = replaceTags(tags, 'tags')
    }
    if (showNegative) {
      tags = replaceTags(tags, 'negativeTags')
    }
    return tags
  }, [showAI, showPrompt, showNegative, hydratedTags, promptTags])

  return (
    <>
      <Box pl="1.5rem" display="flex" flexDirection="row" alignItems="center" gap="0.25rem">
        <Typography variant="h6" sx={{ m: '0' }}>Tags</Typography>
        <Tooltip title="Left-click to add to the tags pool, then keep clicking to cycle through the pools">
          <InfoOutlinedIcon fontSize="small" sx={{ color: 'text.secondary', mr: '1rem' }}/>
        </Tooltip>
        <FormControlLabel
          control={<Switch
            onChange={(e) => setShowAI(e.target.checked)}
            checked={showAI}
          />}
          label="AI"
        />
        <FormControlLabel
          control={<Switch
            onChange={(e) => setShowPrompt(e.target.checked)}
            checked={showPrompt}
          />}
          label="Prompt"
        />
        <FormControlLabel
          control={<Switch
            onChange={(e) => setShowNegative(e.target.checked)}
            checked={showNegative}
          />}
          label="Negative"
        />
      </Box>
      <Box flex={1} px="1rem" sx={{
        overflowY: 'auto',
      }}>
        <Paper elevation={3}>
          <TagContainer>
            {viewTags.map((tag) => (
              <ImageTag tag={tag} key={tag.name}/>
            ))}
          </TagContainer>
        </Paper>
      </Box>
    </>
  )
}