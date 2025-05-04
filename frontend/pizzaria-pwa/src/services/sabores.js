import api from './api';

export async function getAll() {
  const resposta = await api.get('/sabores');
  return resposta.data;
}

export async function getById(id) {
  const resposta = await api.get(`/sabores/${id}`);
  return resposta.data;
}

export async function create(dados) {
  const resposta = await api.post('/sabores', dados);
  return resposta.data; 
}

export async function update(id, dados) {
  const resposta = await api.put(`/sabores/${id}`, dados);
  return resposta.data; 
}

export async function remove(id) {
  await api.delete(`/sabores/${id}`);
}
