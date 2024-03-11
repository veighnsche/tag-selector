export interface ImageGenerateParams {
  cfg_scale: number;
  height: number;
  negative_prompt: string;
  prompt: string;
  restore_faces: boolean;
  sampler_index: string;
  seed: number;
  steps: number;
  width: number;

  enable_hr: boolean;
  hr_scale: number;
  hr_second_pass_steps: number;
  hr_upscaler: string;
  denoising_strength: number;

  refiner_checkpoint: string;
  refiner_switch_at: number;
}
