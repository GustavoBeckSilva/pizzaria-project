import React, { useState, useEffect, useContext } from 'react';
import { AutenticacaoContext } from '../../context/AutenticacaoContext'; 
import * as usuariosService from '../../services/usuarios';
import Button from '../../components/Button'; 
import FormInput from '../../components/FormInput';

const PerfilPage = () => {
  const { usuario, refreshUsuario } = useContext(AutenticacaoContext); 

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    confirmarSenha: '',
  });

  useEffect(() => {
    if (usuario) {
      setFormData({
        nome: usuario.nome,
        email: usuario.email,
        senha: '',
        confirmarSenha: '',
      });
    }
  }, [usuario]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (formData.senha && formData.senha !== formData.confirmarSenha) {
      setError('As senhas não coincidem.');
      return;
    }

    setLoading(true);
    try {
      const dadosParaAtualizar = {
        nome: formData.nome,
        email: formData.email,
      };

      if (formData.senha) {
        dadosParaAtualizar.senha = formData.senha;
      }
      
      await usuariosService.update(usuario.id, dadosParaAtualizar);
      
      if (refreshUsuario) {
        await refreshUsuario();
      }
      
      setSuccess('Perfil atualizado com sucesso!');
      setIsEditing(false);
    } catch (err) {
      const message = err.response?.data?.message || 'Falha ao atualizar o perfil.';
      setError(message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const ViewMode = () => (
    <>
      <div className="card-body">
        <ul className="list-group list-group-flush">
          <li className="list-group-item d-flex justify-content-between align-items-center">
            <strong>Nome:</strong>
            <span>{usuario.nome}</span>
          </li>
          <li className="list-group-item d-flex justify-content-between align-items-center">
            <strong>Email:</strong>
            <span>{usuario.email}</span>
          </li>
          <li className="list-group-item d-flex justify-content-between align-items-center">
            <strong>Tipo de Conta:</strong>
            <span className="text-capitalize">{usuario.tipo_usuario}</span>
          </li>
        </ul>
      </div>
      <div className="card-footer text-center">
        <Button onClick={() => setIsEditing(true)}>Editar Perfil</Button>
      </div>
    </>
  );

  const EditMode = () => (
    <form onSubmit={handleSave}>
      <div className="card-body">
        <FormInput
          label="Nome"
          type="text"
          id="nome"
          name="nome"
          value={formData.nome}
          onChange={handleInputChange}
          required
        />
        <FormInput
          label="Email"
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          required
        />
        <hr className="my-4" />
        <p className="text-muted small">Deixe os campos de senha em branco para não alterá-la.</p>
        <FormInput
          label="Nova Senha"
          type="password"
          id="senha"
          name="senha"
          value={formData.senha}
          onChange={handleInputChange}
          autoComplete="new-password"
        />
        <FormInput
          label="Confirmar Nova Senha"
          type="password"
          id="confirmarSenha"
          name="confirmarSenha"
          value={formData.confirmarSenha}
          onChange={handleInputChange}
          autoComplete="new-password"
        />
      </div>
      <div className="card-footer d-flex justify-content-center gap-3">
        <Button type="button" className="btn-secondary" onClick={() => setIsEditing(false)} disabled={loading}>
          Cancelar
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Salvando...' : 'Salvar Alterações'}
        </Button>
      </div>
    </form>
  );

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card shadow-sm">
            <div className="card-header text-center">
              <h2 className="mb-0">Meu Perfil</h2>
            </div>
            <div className="px-3 pt-3">
              {error && <div className="alert alert-danger">{error}</div>}
              {success && <div className="alert alert-success">{success}</div>}
            </div>
            {isEditing ? <EditMode /> : <ViewMode />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerfilPage;