import styled from '@emotion/styled';
import CloseIcon from '@mui/icons-material/Close';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { Box, Button, ButtonGroup, Divider, Paper } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useFetchImageData } from '../../hooks/useFetchImageData';
import { useModalNavigation } from '../../hooks/useModalNavigation';
import { useAppDispatch } from '../../store';
import { setInputsFromImageData, setLlmEnhancePrompt, setRefiner } from '../../store/reducers/inputs';
import { setTagsFromImageData } from '../../store/reducers/tags';
import { ImageCustomData } from '../../types/image-custom-data';
import { FullImageDataType, ImageDataType } from '../../types/image-data';
import { PromptTagsType, TagType } from '../../types/image-input';
import { makeTagLabelWrapped } from '../../utils/tags';
import { ImageDataProperty } from './ImageDataProperty';
import { ImageTagList } from './ImageTagList';

const StyledPaper = styled(Paper, {
  shouldForwardProp: (prop) => prop !== 'open',
})<{
  open: boolean;
}>`
    width: ${(props) => (props.open ? 30 /** todo: should be a 3:2 ratio */ + 'vw' : '0vw')};
    height: 100vh;
    transition: width 0.8s ease-in-out;
    overflow: hidden;
    position: relative;
`;

interface ImageDataProps {
  filename: string;
  open: boolean;
}

interface ImageDataPropertyType {
  name: string;
  property: keyof ImageDataType;
  fullWidth?: boolean;
}

const DataContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
`;

const propertyList: ImageDataPropertyType[] = [
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
];

type SelectableProperties = keyof ImageDataType | 'refiner' | 'llmPrompt' | 'scene' | 'tags' | 'negativeTags';

export const ImageData = ({ filename, open }: ImageDataProps) => {
  const [data, setData] = useState<FullImageDataType | null>(null);
  const fetchImageData = useFetchImageData();
  const [selected, setSelected] = useState<SelectableProperties[]>([]);
  const dispatch = useAppDispatch();
  const { navigateFirst, navigateNext, navigatePrevious, closeModal } = useModalNavigation();

  const negativeTags = data?.customData[ImageCustomData.PROMPT_TAGS].negativeTags;
  const promptTags = data?.customData[ImageCustomData.PROMPT_TAGS].tags;
  const scene = data?.customData[ImageCustomData.INPUTS].prompt.scene;

  const llmEnhance = data?.customData[ImageCustomData.INPUTS].options.llmEnhance;
  const llmPrompt = llmEnhance?.prompt;

  const refiner = data?.customData[ImageCustomData.INPUTS].options.refiner;
  const refinerCheckpoint = refiner?.checkpoint;
  const refinerSwitchAt = refiner?.switchAt;

  useEffect(() => {
    if (filename && open) {
      fetchImageData(filename).then((data) => {
        console.log('ImageData', data)
        setData(data);
      });
    }
  }, [filename, open]);

  function isSelected(property: SelectableProperties) {
    return selected.includes(property);
  }

  function buttonVariant(property: SelectableProperties) {
    return isSelected(property) ? 'contained' : 'outlined';
  }

  function selectAll() {
    const allProperties = propertyList.map((property) => property.property);
    setSelected([...allProperties, 'refiner', 'llmPrompt', 'scene', 'tags', 'negativeTags']);
  }

  function replaceTagNames(tags: TagType[]): TagType[] {
    return tags.map(tag => {
      if (tag.choices) {
        return {
          ...tag,
          name: tag.choices,
        };
      }
      return tag;
    })
  }

  function replaceSelected() {
    if (data) {
      const selectedData = selected
      .filter((selected) => propertyList.some((property) => property.property === selected))
      .reduce((acc, curr) => {
        const prop = curr as keyof ImageDataType;
        acc[prop] = data.imageData[prop] as any;
        return acc;
      }, {} as Partial<ImageDataType>);

      if (isSelected('scene')) {
        selectedData.prompt = scene;
      }

      dispatch(setInputsFromImageData(selectedData));

      const selectedTags: Partial<PromptTagsType> = {};
      if (isSelected('tags') && promptTags) {
        selectedTags.tags = replaceTagNames(promptTags);
      }
      if (isSelected('negativeTags') && negativeTags) {
        selectedTags.negativeTags = replaceTagNames(negativeTags);
      }

      dispatch(setTagsFromImageData(selectedTags));

      if (isSelected('llmPrompt')) {
        dispatch(setLlmEnhancePrompt(llmPrompt as string));
      }

      if (isSelected('refiner')) {
        dispatch(setRefiner({
          checkpoint: refinerCheckpoint as string,
          switchAt: refinerSwitchAt as number,
        }))
      }

      setSelected([]);
    }
  }

  function toggleProperty(property: SelectableProperties) {
    if (isSelected(property)) {
      setSelected(selected.filter((p) => p !== property));
    }
    else {
      setSelected([...selected, property]);
    }
  }

  function showLlmPrompt(): boolean {
    return Boolean(llmPrompt && llmEnhance?.enabled);
  }

  return (
    <StyledPaper
      square
      open={open}
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
        height="100vh"
        max-height="100vh"
        width="30vw"
      >
        <Box display="flex" flexDirection="column" alignItems="center" padding="1rem" overflow="auto">
          {data ? (
            <DataContainer>
              {scene ? (
                <ImageDataProperty
                  name="Scene"
                  variant={buttonVariant('scene')}
                  toggle={() => toggleProperty('scene')}
                  value={scene}
                  fullWidth
                />
              ) : null}
              {promptTags?.length ? (
                <ImageDataProperty
                  name="Tags"
                  variant={buttonVariant('tags')}
                  toggle={() => toggleProperty('tags')}
                  value={promptTags?.map(makeTagLabelWrapped).join(', ')}
                  fullWidth
                />
              ) : null}
              {negativeTags?.length ? (
                <ImageDataProperty
                  name="Negative tags"
                  variant={buttonVariant('negativeTags')}
                  toggle={() => toggleProperty('negativeTags')}
                  value={negativeTags?.map(makeTagLabelWrapped).join(', ')}
                  fullWidth
                />
              ) : null}
              {showLlmPrompt() ? (
                <ImageDataProperty
                  name="LLM Prompt"
                  variant={buttonVariant('llmPrompt')}
                  toggle={() => toggleProperty('llmPrompt')}
                  value={llmPrompt}
                  fullWidth
                />
              ) : null}
              {refinerCheckpoint ? (
                <ImageDataProperty
                  name={`Refiner`}
                  variant={buttonVariant('refiner')}
                  toggle={() => toggleProperty('refiner')}
                  value={`${refinerSwitchAt}% ${refinerCheckpoint.split('.')[0]}`}
                  fullWidth
                />
              ) : null}
              {propertyList.map(({ fullWidth, name, property }) =>
                data?.imageData[property] ? (
                  <ImageDataProperty
                    key={property}
                    variant={buttonVariant(property)}
                    toggle={() => toggleProperty(property)}
                    name={name}
                    value={data?.imageData[property]}
                    fullWidth={fullWidth}
                  />
                ) : null,
              )}
            </DataContainer>
          ) : null}
          <ButtonGroup fullWidth>
            <Button variant="outlined" fullWidth color="secondary" onClick={selectAll}>
              Select All
            </Button>
            <Button variant="contained" fullWidth color="secondary" onClick={replaceSelected}>
              Replace Selected
            </Button>
          </ButtonGroup>
        </Box>
        <Divider flexItem sx={{ mb: 2 }} />
        <ImageTagList tags={data?.customData.tags} promptTags={data?.customData.promptTags} />
        <Box p={2} fontSize="0.6rem" mt="1rem" maxHeight="20rem" sx={{ overflowY: 'auto' }}>
          {data?.imageData.prompt}
        </Box>
        <Box p="1rem">
          <ButtonGroup fullWidth variant="outlined">
            <Button
              onClick={navigateFirst}
              sx={{
                width: '20%',
              }}
            >
              <FirstPageIcon />
            </Button>
            <Button onClick={navigatePrevious}>
              <NavigateBeforeIcon />
            </Button>
            <Button onClick={navigateNext}>
              <NavigateNextIcon />
            </Button>
            <Button
              onClick={closeModal}
              sx={{
                width: '20%',
              }}
            >
              <CloseIcon />
            </Button>
          </ButtonGroup>
        </Box>
      </Box>
    </StyledPaper>
  );
};
