import api from './api';

export const login = async (credenciais) => {
  const response = await api.post('/auth/login', credenciais);
  return response.data;
};

export const register = async (dados) => {
  const response = await api.post('/auth/register', dados);
  return response.data;
};
