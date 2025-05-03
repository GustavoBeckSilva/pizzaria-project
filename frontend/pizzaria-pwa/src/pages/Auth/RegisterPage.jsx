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
    setCarregando(true);
    try {
      // tipo_usuario fixo como CLIENTE na UI
      const dadosRegistro = { ...form, tipo_usuario: PAPEIS.CLIENTE };
      const { user, token } = await authService.register(dadosRegistro);
      fazerLogin(user, token);
      navigate('/cliente/menu', { replace: true });
    } catch (err) {
      const msg = err.response?.data?.error || 'Erro ao registrar';
      setErro(msg);
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
          <Button type="submit" disabled={carregando}>
            {carregando ? 'Registrando...' : 'Registrar'}
          </Button>
        </form>
      </div>
    </div>
  );
}
