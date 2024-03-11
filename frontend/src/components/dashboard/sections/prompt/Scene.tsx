import MenuIcon from '@mui/icons-material/Menu';
import {
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
} from '@mui/material';
import { ChangeEvent, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../store';
import { selectScene, setScene } from '../../../../store/reducers/inputs';
import { TagMenu } from './TagMenu';

export const Scene = () => {
  const scene = useAppSelector(selectScene);
  const [menuAnchorEl, setMenuAnchorEl] = useState<HTMLElement | null>(null);
  const isMenuOpen = Boolean(menuAnchorEl);
  const dispatch = useAppDispatch();
  const [text, setText] = useState(scene);

  useEffect(() => {
    if (text !== scene) {
      setText(scene);
    }
  }, [scene]);

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    setText(event.target.value);
  }

  function handleClose() {
    setMenuAnchorEl(null);
  }

  return (
    <>
      <FormControl>
        <InputLabel>Scene</InputLabel>
        <OutlinedInput
          label="Scene"
          value={text}
          onChange={handleChange}
          onBlur={() => dispatch(setScene(text))}
          startAdornment={
            <InputAdornment position="start">
              <IconButton
                size="small"
                onClick={(event) => setMenuAnchorEl(event.currentTarget)}
              >
                <MenuIcon fontSize="small" />
              </IconButton>
            </InputAdornment>
          }
        />
      </FormControl>
      <TagMenu
        isMenuOpen={isMenuOpen}
        onClose={handleClose}
        menuAnchorEl={menuAnchorEl}
      />
    </>
  );
};
