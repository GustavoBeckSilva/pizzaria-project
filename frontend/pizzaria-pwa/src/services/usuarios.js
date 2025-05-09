// src/services/usuarios.js
import api from './api';

/**
 * Busca todos os usuários (clientes e pizzaiolos).
 * @returns {Promise<Array<{ id: number, nome: string, email: string, tipo_usuario: string }>>}
 */
export async function getAll() {
  const { data } = await api.get('/usuarios');
  return data;
}

/**
 * Busca um usuário pelo ID.
 * @param {number|string} id
 * @returns {Promise<{ id: number, nome: string, email: string, tipo_usuario: string }>}
 */
export async function getById(id) {
  const { data } = await api.get(`/usuarios/${id}`);
  return data;
}
