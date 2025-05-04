import api from './api';

export async function getAll() {
  const resposta = await api.get('/pedidos/all');
  return resposta.data;
}

export async function updateStatus(pedidoId, status) {
  await api.patch(`/pedidos/${pedidoId}/status`, { status });
}

export async function getUserOrders() {
    const resposta = await api.get('/pedidos');
    return resposta.data;
  }
  
  export async function getById(id) {
    const resposta = await api.get(`/pedidos/${id}`);
    return resposta.data;
  }
  
  export async function create() {
    const resposta = await api.post('/pedidos');
    return resposta.data;
  }