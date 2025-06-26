import api from './api';

export async function getAll() {
  const { data } = await api.get('/usuarios');
  return data;
}

export async function getById(id) {
  const { data } = await api.get(`/usuarios/${id}`);
  return data;
}

export async function update(id, dados) {
  const { data } = await api.put(`/usuarios/${id}`, dados);
  return data;
}