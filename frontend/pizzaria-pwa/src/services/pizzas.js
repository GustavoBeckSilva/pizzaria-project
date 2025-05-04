// src/services/pizzas.js
import api from './api';

export async function addPizza(pedidoId, pizzaData) {

  const resposta = await api.post(
    `/pedidos/${pedidoId}/pizzas`,
    pizzaData
  );
  return resposta.data;
}
