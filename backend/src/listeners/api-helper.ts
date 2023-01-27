import axios from 'axios'

export async function fetchLoras() {
  const rawLoras: string[] = await axios.get('http://192.168.178.18:7123/api/loras')
    .then(response => response.data)
  return rawLoras.filter(lora => !lora.endsWith('.txt')).map(lora => lora.split('.')[0])
}

export async function fetchVaes() {
  const rawVaes: string[] = await axios.get('http://192.168.178.18:7123/api/vaes')
    .then(response => response.data)
  return rawVaes.filter(vae => !vae.endsWith('.txt'))
}