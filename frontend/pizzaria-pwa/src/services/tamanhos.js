import api from './api';

export async function getAll() {
  const resposta = await api.get('/tamanhos');
  return resposta.data;
}