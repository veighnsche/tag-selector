import styled from '@emotion/styled';
import { Button, Paper } from '@mui/material';
import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../store';
import { selectSize, setSize } from '../../../../store/reducers/inputs';

const StyledPaper = styled(Paper)`
    padding: 0.75rem;
    width: 100%;

    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
`;

const RatioButton = styled(Button)`
    width: 30%;
    height: 4rem;
`;

const RatioButtonArWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
`;

const RatioButtonAr = styled(Button)`
    height: 4rem;
`;

const totalPixelChoices = [512 * 512, 512 * 768, 768 * 768, 768 * 1024, 1024 * 1024];

const aspectRatioChoices = [
  { width: 4, height: 3 },
  { width: Math.round(Math.sqrt(2) * 1000) / 1000, height: 1 },
  { width: 3, height: 2 },
  { width: 16, height: 9 },
  { width: 2, height: 1 },
  { width: 2.39, height: 1 },
];

function calculateRatio(totalPixels: number, widthRatio: number, heightRatio: number) {
  const width = Math.sqrt(totalPixels * (heightRatio / widthRatio));
  const height = width * (widthRatio / heightRatio);

  return {
    width: Math.round(width),
    height: Math.round(height),
  };
}

export const ImageRatio = () => {
  const dispatch = useAppDispatch();
  const selectedSize = useAppSelector(selectSize);
  const [selectedRatio, setSelectedRatio] = useState<{
    width: number;
    height: number;
  }>(aspectRatioChoices[2]);

  const imageSizes = totalPixelChoices.flatMap((totalPixels) => [
    calculateRatio(totalPixels, selectedRatio.width, selectedRatio.height),
    calculateRatio(totalPixels, 1, 1),
    calculateRatio(totalPixels, selectedRatio.height, selectedRatio.width),
  ]);

  return (
    <StyledPaper elevation={2}>
      <RatioButtonArWrapper>
        {aspectRatioChoices.map((ratio, index) => (
          <RatioButtonAr
            key={index}
            variant="outlined"
            onClick={() => {
              setSelectedRatio(ratio);
            }}
            sx={{
              color: selectedRatio === ratio ? 'secondary.main' : 'primary.main',
            }}
            color={selectedRatio === ratio ? 'secondary' : 'primary'}
          >
            {ratio.width}:{ratio.height}
          </RatioButtonAr>
        ))}
      </RatioButtonArWrapper>

      {imageSizes.map(({ width, height }) => {
        const isSelected = selectedSize.width === width && selectedSize.height === height;

        const handleClick = () => {
          dispatch(setSize({ width, height }));
        };

        return (
          <RatioButton
            key={`${width}x${height}`}
            variant="outlined"
            onClick={handleClick}
            title={`${width}x${height}`}
            color={isSelected ? 'secondary' : 'primary'}
          >
            <Paper
              elevation={6}
              sx={{
                width: width / 20,
                height: height / 20,
                backgroundColor: isSelected ? 'secondary.main' : 'primary.main',
              }}
            />
          </RatioButton>
        );
      })}
    </StyledPaper>
  );
};
