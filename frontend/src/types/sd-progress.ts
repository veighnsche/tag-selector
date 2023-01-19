export interface SdProgressType {
  progress: number
  eta_relative: number // seconds
  current_image: string
  state: {
    sampling_step: number
    sampling_steps: number
  }
}