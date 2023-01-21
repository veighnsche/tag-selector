import { useAppSelector } from '../store'
import { selectInputs } from '../store/reducers/inputs'
import { selectSdStatus } from '../store/reducers/sdStatus'
import { selectTagsForInputs } from '../store/reducers/tags'
import { SdStatus } from '../types'
import { useEmitters } from './useEmitters'

export function useGenerateImage() {
  const inputs = useAppSelector(selectInputs)
  const addTagsToInput = useAppSelector(selectTagsForInputs)
  const sdStatus = useAppSelector(selectSdStatus)
  const emit = useEmitters()

  return () => {
    if (sdStatus === SdStatus.READY) {
      emit.generateImage(addTagsToInput(inputs))
    }
  }
}
