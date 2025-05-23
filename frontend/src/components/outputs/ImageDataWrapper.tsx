import { ReactNode } from 'react';
import { useEmitters } from '../../hooks/useEmitters';
import { useFetchImageData } from '../../hooks/useFetchImageData';
import { useAppDispatch } from '../../store';
import { removeImage, setModalImage, toggleModal } from '../../store/reducers/images';
import { setSeed } from '../../store/reducers/inputs';

interface ImageWrapperProps {
  children: (props: ImageWrapperChildrenProps) => ReactNode;
  filename: string;
  arrayIdx: number;
}

interface ImageWrapperChildrenProps {
  setSeed: () => void;
  handleDelete: () => void;
  openModal: () => void;
}

export const ImageDataWrapper = ({ children, filename, arrayIdx }: ImageWrapperProps) => {
  const dispatch = useAppDispatch();
  const emit = useEmitters();
  const fetchImageData = useFetchImageData();

  function handleDelete() {
    dispatch(removeImage(arrayIdx));
    emit.removeImage(filename);
  }

  async function setSeedFromImage() {
    const data = await fetchImageData(filename);
    dispatch(setSeed(data.imageData.seed));
  }

  function openModal() {
    dispatch(setModalImage(filename));
    dispatch(toggleModal());
  }

  return (
    <>
      {children({
        setSeed: setSeedFromImage,
        handleDelete,
        openModal,
      })}
    </>
  );
};
