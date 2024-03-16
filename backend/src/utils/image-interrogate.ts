import axios from 'axios';
import { INTERROGATE_URL } from '../constants';

export async function imageInterrogate(base64Png: string): Promise<string[]> {
  const tags = await axios.post(`${INTERROGATE_URL}/sdapi/v1/interrogate`, {
    model: 'deepdanbooru',
    image: base64Png,
  })
  .then((response) => response.data);

  return tags.caption.split(', ');
}