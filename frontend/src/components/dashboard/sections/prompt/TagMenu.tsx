import ClearIcon from '@mui/icons-material/Clear';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { ListItemIcon, ListItemText, Menu, MenuItem } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../../../store';
import { setScene } from '../../../../store/reducers/inputs';
import { resetTags } from '../../../../store/reducers/tags';
import { selectShowHiddenTags, toggleShowHiddenTags } from '../../../../store/reducers/tagsState';

interface TagMenuProps {
  isMenuOpen: boolean;
  onClose: () => void;
  menuAnchorEl: HTMLElement | null;
}

export const TagMenu = ({ isMenuOpen, onClose, menuAnchorEl }: TagMenuProps) => {
  const dispatch = useAppDispatch();
  const showHidden = useAppSelector(selectShowHiddenTags);
  return (
    <Menu open={isMenuOpen} onClose={onClose} anchorEl={menuAnchorEl}>
      <MenuItem
        onClick={() => {
          dispatch(toggleShowHiddenTags());
        }}
      >
        <ListItemIcon>
          {showHidden ? <VisibilityIcon fontSize="small" /> : <VisibilityOffIcon fontSize="small" />}
        </ListItemIcon>
        <ListItemText>{showHidden ? 'Hide ' : 'Show '}hidden tags</ListItemText>
      </MenuItem>
      <MenuItem
        onClick={() => {
          dispatch(resetTags());
          dispatch(setScene(''));
          onClose();
        }}
      >
        <ListItemIcon>
          <ClearIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText>Clear scene and all tags</ListItemText>
      </MenuItem>
    </Menu>
  );
};
