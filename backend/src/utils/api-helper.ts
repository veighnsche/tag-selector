import axios from 'axios';
import { HELPER_URL } from '../constants';

export async function fetchLoras() {
  const rawLoras: string[] = await axios.get(`${HELPER_URL}/api/loras`)
  .then(response => response.data);
  return rawLoras.filter(lora => !lora.endsWith('.txt')).map(lora => lora.split('.')[0]);
}

export async function fetchLycoris() {
  const rawLycoris: string[] = await axios.get(`${HELPER_URL}/api/lycoris`)
  .then(response => response.data);
  return rawLycoris.filter(lycoris => !lycoris.endsWith('.txt')).map(lycoris => lycoris.split('.')[0]);
}

export async function fetchVaes() {
  const rawVaes: string[] = await axios.get(`${HELPER_URL}/api/vaes`)
  .then(response => response.data);
  return rawVaes.filter(vae => !vae.endsWith('.txt'));
}