import api from './api';

export async function getAll() {
  const resposta = await api.get('/pedidos/all');
  return resposta.data;
}

export async function updateStatus(pedidoId, status) {
  await api.patch(`/pedidos/${pedidoId}/status`, { status });
}
