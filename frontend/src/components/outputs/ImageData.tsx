import styled from '@emotion/styled'
import CloseIcon from '@mui/icons-material/Close'
import FirstPageIcon from '@mui/icons-material/FirstPage'
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore'
import NavigateNextIcon from '@mui/icons-material/NavigateNext'
import { Box, Button, ButtonGroup, IconButton, Paper, Tooltip, Typography } from '@mui/material'
import React, { ReactElement, useEffect, useState } from 'react'
import { useFetchImageData } from '../../hooks/useFetchImageData'
import { useModalNavigation } from '../../hooks/useModalNavigation'
import { useAppDispatch } from '../../store'
import { setInputsFromImageData } from '../../store/reducers/inputs'
import { setTagsFromImageData } from '../../store/reducers/tags'
import { ImageCustomData } from '../../types/image-custom-data'
import { FullImageDataType, ImageDataType } from '../../types/image-data'
import { PromptTagsType } from '../../types/image-input'
import { makeTagLabelWrapped } from '../../utils/tags'
import { ImageTagList } from './ImageTagList'

const StyledPaper = styled(Paper, {
  shouldForwardProp: (prop) => prop !== 'open',
})<{
  open: boolean
}>`
  width: ${(props) => (props.open ? '30vw' : '0vw')};
  height: 100vh;
  transition: width 0.8s ease-in-out;
  overflow: hidden;
  position: relative;
`

// text only on 1 line and ellipsis
const StyledButton = styled(Button)`
  text-transform: none;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

interface ImageDataProps {
  filename: string
  open: boolean
  onClose: () => void
}

interface ImageDataPropertyProps {
  name: string
  property: keyof ImageDataType
  fullWidth?: boolean
}

const DataContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 1rem;
`

const propertyList: ImageDataPropertyProps[] = [
  {
    name: 'Model',
    property: 'model',
    fullWidth: true,
  },
  {
    name: 'Width',
    property: 'width',
  },
  {
    name: 'Height',
    property: 'height',
  },
  {
    name: 'Steps',
    property: 'steps',
  },
  {
    name: 'CFG scale',
    property: 'cfg',
  },
  {
    name: 'Seed',
    property: 'seed',
  },
  {
    name: 'Sampling method',
    property: 'samplingMethod',
  },
]

type SelectableProperties = keyof ImageDataType | 'scene' | 'tags' | 'negativeTags'

export const ImageData = ({ filename, open, onClose }: ImageDataProps) => {
  const [data, setData] = useState<FullImageDataType | null>(null)
  const fetchImageData = useFetchImageData()
  const [selected, setSelected] = useState<SelectableProperties[]>([])
  const dispatch = useAppDispatch()
  const { navigateFirst, navigateNext, navigatePrevious } = useModalNavigation()

  const negativeTags = data?.customData[ImageCustomData.PROMPT_TAGS].negativeTags
  const promptTags = data?.customData[ImageCustomData.PROMPT_TAGS].tags
  const scene = data?.customData[ImageCustomData.INPUTS].prompt.scene

  useEffect(() => {
    if (filename && open) {
      fetchImageData(filename).then((data) => {
        setData(data)
      })
    }
  }, [filename, open])

  function isSelected(property: SelectableProperties) {
    return selected.includes(property)
  }

  function buttonVariant(property: SelectableProperties) {
    return isSelected(property) ? 'contained' : 'outlined'
  }

  function selectAll() {
    const allProperties = propertyList.map((property) => property.property)
    setSelected([...allProperties, 'scene', 'tags', 'negativeTags'])
  }

  function replaceSelected() {
    if (data) {
      const selectedData = selected.filter(
        selected => propertyList.some(property => property.property === selected),
      ).reduce((acc, curr) => {
        const prop = curr as keyof ImageDataType
        acc[prop] = data.imageData[prop] as any
        return acc
      }, {} as Partial<ImageDataType>)

      if (isSelected('scene')) {
        selectedData.prompt = scene
      }

      dispatch(setInputsFromImageData(selectedData))

      let selectedTags: Partial<PromptTagsType> = {}
      if (isSelected('tags')) {
        selectedTags.tags = promptTags
      }
      if (isSelected('negativeTags')) {
        selectedTags.negativeTags = negativeTags
      }
      dispatch(setTagsFromImageData(selectedTags))
    }
  }

  function toggleProperty(property: SelectableProperties) {
    if (isSelected(property)) {
      setSelected(selected.filter((p) => p !== property))
    }
    else {
      setSelected([...selected, property])
    }
  }

  const ImageDataProperty = ({ name, value, property, fullWidth }: Omit<ImageDataPropertyProps, 'property'> & {
    value: any;
    property: SelectableProperties;
  }) => {
    const display = value.toString().slice(0, 50)
    const isLonger = value.toString().length > 50

    const TooltipWrapper = ({ children }: { children: ReactElement }) => {
      if (!isLonger) {
        return <>{children}</>
      }
      return (
        <Tooltip title={value.toString()}>
          {children}
        </Tooltip>
      )
    }

    return (
      <Box display="flex" flexDirection="column" width={fullWidth ? '100%' : '48.5%'}>
        <Typography variant="caption">
          {name}
        </Typography>
        <TooltipWrapper>
          <StyledButton
            fullWidth={fullWidth}
            size="small"
            variant={buttonVariant(property)}
            onClick={(e) => {
              e.stopPropagation()
              toggleProperty(property)
            }}
          >
            {`${display}${isLonger ? '...' : ''}`}
          </StyledButton>
        </TooltipWrapper>
      </Box>
    )
  }

  return (
    <StyledPaper square open={open} onClick={(e) => {
      e.stopPropagation()
    }}>
      <IconButton onClick={onClose} size="small" sx={{
        position: 'absolute',
        top: '1rem',
        right: '1rem',
      }}>
        <CloseIcon fontSize="small"/>
      </IconButton>
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
        height="100vh"
        max-height="100vh"
        width="30vw"
      >
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          padding="1rem"
          overflow="auto"
        >
          {data ? (
            <DataContainer>
              {scene ? (
                <ImageDataProperty
                  name="Scene"
                  property="scene"
                  value={scene}
                  fullWidth
                />
              ) : null}
              {promptTags?.length ? (
                <ImageDataProperty
                  name="Tags"
                  property="tags"
                  value={promptTags?.map(makeTagLabelWrapped).join(', ')}
                  fullWidth
                />
              ) : null}
              {negativeTags?.length ? (
                <ImageDataProperty
                  name="Negative tags"
                  property="negativeTags"
                  value={negativeTags?.map(makeTagLabelWrapped).join(', ')}
                  fullWidth
                />
              ) : null}
              {propertyList.map(({ fullWidth, name, property }) => {
                return data?.imageData[property] ? (
                  <ImageDataProperty
                    key={property}
                    property={property}
                    name={name}
                    value={data?.imageData[property]}
                    fullWidth={fullWidth}
                  />
                ) : null
              })}
            </DataContainer>
          ) : null}
          <Box display="flex" gap="0.5rem" width="100%" mt="1rem">
            <Button
              variant="outlined"
              fullWidth
              color="secondary"
              onClick={selectAll}
            >
              Select All
            </Button>
            <Button
              variant="contained"
              fullWidth
              color="secondary"
              onClick={replaceSelected}
            >
              Replace Selected
            </Button>
          </Box>
        </Box>
        <ImageTagList tags={data?.customData.tags} promptTags={data?.customData.promptTags}/>
        <Box p="1rem" mt="1rem">
          <ButtonGroup fullWidth variant="outlined">
            <Button onClick={navigateFirst} sx={{
              width: '20%',
            }}>
              <FirstPageIcon/>
            </Button>
            <Button onClick={navigatePrevious}>
              <NavigateBeforeIcon/>
            </Button>
            <Button onClick={navigateNext}>
              <NavigateNextIcon/>
            </Button>
          </ButtonGroup>
        </Box>
      </Box>
    </StyledPaper>
  )
}
