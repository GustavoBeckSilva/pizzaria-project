import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import FormInput from '../../components/FormInput';
import Button from '../../components/Button';
import * as authService from '../../services/auth';
import { AutenticacaoContext } from '../../context/AutenticacaoContext';
import { PAPEIS } from '../../utils/constantes';

export default function RegisterPage() {
  const [form, setForm] = useState({
    nome: '',
    email: '',
    senha: '',
    tipo_usuario: '',
    adminSecret: ''
  });
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);
  const { fazerLogin } = useContext(AutenticacaoContext);
  const navigate = useNavigate();

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErro('');

    if (!form.tipo_usuario) {
      setErro('Selecione o tipo de usuário');
      return;
    }
    if (form.tipo_usuario === PAPEIS.PIZZAIOTO && !form.adminSecret) {
      setErro('Informe o código de pizzaiolo');
      return;
    }

    setCarregando(true);
    try {
      const dados = {
        nome: form.nome,
        email: form.email,
        senha_hash: form.senha,
        tipo_usuario: form.tipo_usuario,
        ...(form.tipo_usuario === PAPEIS.PIZZAIOTO && { adminSecret: form.adminSecret })
      };

      const { user, token } = await authService.register(dados);
      fazerLogin(user, token);

      const destino = form.tipo_usuario === PAPEIS.CLIENTE
        ? '/cliente/menu'
        : '/pizzaiolo/pedidos';
      navigate(destino, { replace: true });
    } catch (err) {
      setErro(err.response?.data?.error || 'Erro ao registrar');
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="row justify-content-center">
      <div className="col-md-6">
        <h2 className="mb-4">Registrar</h2>
        {erro && <div className="alert alert-danger">{erro}</div>}
        <form onSubmit={handleSubmit}>
          <FormInput
            label="Nome"
            name="nome"
            value={form.nome}
            onChange={handleChange}
            placeholder="Seu nome completo"
          />
          <FormInput
            label="E‑mail"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="seu@email.com"
          />
          <FormInput
            label="Senha"
            name="senha"
            type="password"
            value={form.senha}
            onChange={handleChange}
            placeholder="••••••••"
          />

          <div className="mb-3">
            <label htmlFor="tipo_usuario" className="form-label">
              Tipo de usuário
            </label>
            <select
              id="tipo_usuario"
              name="tipo_usuario"
              className="form-select"
              value={form.tipo_usuario}
              onChange={handleChange}
            >
              <option value="">Selecione...</option>
              <option value={PAPEIS.CLIENTE}>Cliente</option>
              <option value={PAPEIS.PIZZAIOTO}>Pizzaiolo</option>
            </select>
          </div>

          {form.tipo_usuario === PAPEIS.PIZZAIOTO && (
            <FormInput
              label="Código de Pizzaiolo"
              name="adminSecret"
              type="password"
              value={form.adminSecret}
              onChange={handleChange}
              placeholder="Informe o código de pizzaiolo"
            />
          )}

          <Button type="submit" disabled={carregando}>
            {carregando ? 'Registrando...' : 'Registrar'}
          </Button>
        </form>
      </div>
    </div>
  );
}
