// src/services/pizzas.js
import api from './api';

export async function addPizza(pedidoId, pizzaData) {

  const resposta = await api.post(
    `/pedidos/${pedidoId}/pizzas`,
    pizzaData
  );
  return resposta.data;
}

export async function getByPedidoId(pedidoId) {
  const resposta = await api.get(`/pedidos/${pedidoId}/pizzas`);
  return resposta.data; 
}
