import { SdModelType } from './sd-models'

export interface SdOptionsType {
  sd_model_checkpoint: SdModelType['title']
  CLIP_stop_at_last_layers: number
  sd_vae: "Automatic" | string
  interrogate_deepbooru_score_threshold: number
}