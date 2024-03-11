import { ClipType } from './type';

export function fetchClipRetrieval({ prompt }: { prompt: string }): Promise<ClipType[]> {
  const url = process.env.REACT_APP_CLIP_RETRIEVAL_URL || 'https://knn5.laion.ai/knn-service';
  return fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text: prompt,
      image: null,
      image_url: null,
      embedding_input: null,
      modality: 'image',
      num_images: 40,
      indice_name: 'laion5B',
      num_result_ids: 3000,
      use_mclip: false,
      deduplicate: true,
      use_safety_model: false,
      use_violence_detector: false,
      aesthetic_score: '',
      aesthetic_weight: '0.5',
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      return data.filter((clip: ClipType) => clip.url);
    })
    .then((data) => {
      // shuffle the data
      return data.sort(() => Math.random() - 0.5);
    });
}
