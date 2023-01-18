export interface ImageGenerateParams {
  cfg_scale: number;
  height: number;
  negative_prompt: string;
  prompt: string;
  restore_faces: boolean;
  sampler_index: string;
  seed: number;
  steps: number
  width: number;
}