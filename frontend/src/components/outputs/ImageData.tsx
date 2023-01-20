import styled from '@emotion/styled'
import CloseIcon from '@mui/icons-material/Close'
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore'
import NavigateNextIcon from '@mui/icons-material/NavigateNext'
import { Box, Button, ButtonGroup, IconButton, Paper, Tooltip, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useFetchImageData } from '../../hooks/useFetchImageData'
import { useModalNavigation } from '../../hooks/useModalNavigation'
import { useAppDispatch } from '../../store'
import { setInputsFromImageData } from '../../store/reducers/inputs'
import { FullImageDataType, ImageDataType } from '../../types/image-data'
import { ImageTags } from './ImageTags'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

const StyledPaper = styled(Paper, {
  shouldForwardProp: (prop) => prop !== 'open',
})<{
  open: boolean
}>`
  width: ${(props) => (props.open ? '20vw' : '0vw')};
  height: 100vh;
  transition: width 0.8s ease-in-out;
  overflow: hidden;
  position: relative;
`

//  - not capitalized and align text to the left
const StyledButton = styled(Button)`
  text-transform: none;
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
    name: 'Prompt',
    property: 'prompt',
    fullWidth: true,
  },
  {
    name: 'Negative Prompt',
    property: 'negativePrompt',
    fullWidth: true,
  },
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

export const ImageData = ({ filename, open, onClose }: ImageDataProps) => {
  const [data, setData] = useState<FullImageDataType | null>(null)
  const fetchImageData = useFetchImageData()
  const [selected, setSelected] = useState<(keyof ImageDataType)[]>([])
  const dispatch = useAppDispatch()
  const { navigateNext, navigatePrevious } = useModalNavigation()

  useEffect(() => {
    if (filename && open) {
      fetchImageData(filename).then((data) => {
        setData(data)
      })
    }
  }, [filename, open])

  function isSelected(property: keyof ImageDataType) {
    return selected.includes(property)
  }

  function buttonVariant(property: keyof ImageDataType) {
    return isSelected(property) ? 'contained' : 'outlined'
  }

  function selectAll() {
    setSelected(propertyList.map((property) => property.property))
  }

  function replaceSelected() {
    if (data) {
      const selectedData = selected.reduce((acc, curr) => {
        acc[curr] = data.imageData[curr] as any
        return acc
      }, {} as Partial<ImageDataType>)
      dispatch(setInputsFromImageData(selectedData))
    }
  }

  function toggleProperty(property: keyof ImageDataType) {
    if (isSelected(property)) {
      setSelected(selected.filter((p) => p !== property))
    }
    else {
      setSelected([...selected, property])
    }
  }

  const ImageDataProperty = ({ name, value, property, fullWidth }: ImageDataPropertyProps & { value: any }) => {
    return (
      <Box display="flex" flexDirection="column" width={fullWidth ? '100%' : '48.5%'}>
        <Typography variant="caption">
          {name}
        </Typography>
        <StyledButton
          fullWidth={fullWidth}
          size="small"
          variant={buttonVariant(property)}
          onClick={(e) => {
            e.stopPropagation()
            toggleProperty(property)
          }}
        >
          {value}
        </StyledButton>
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
        width="20vw"
      >
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          padding="1rem"
        >
          {data ? (
            <DataContainer>
              {propertyList.map(({ fullWidth, name, property }) => data?.imageData[property] ? (
                <ImageDataProperty
                  key={property}
                  property={property}
                  name={name}
                  value={data?.imageData[property]}
                  fullWidth={fullWidth}
                />
              ) : null)}
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
        <Box pl="1.5rem" display="flex" flexDirection="row" alignItems="center" gap="0.25rem">
          <Typography variant="h6" sx={{ m: '0' }}>Tags</Typography>
          <Tooltip title="Right-click to toggle tag in negative prompt.">
            <InfoOutlinedIcon fontSize="small" sx={{ color: 'text.secondary' }}/>
          </Tooltip>
        </Box>
        <Box flex={1} px="1rem" sx={{
          overflowY: 'auto',
        }}>
          <Paper elevation={3}>
            <ImageTags tags={data?.customData.tags}/>
          </Paper>
        </Box>
        <Box p="1rem" mt="1rem">
          <ButtonGroup fullWidth variant="outlined">
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
