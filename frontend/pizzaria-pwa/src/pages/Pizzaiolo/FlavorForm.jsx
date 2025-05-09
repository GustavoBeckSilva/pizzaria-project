import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import FormInput from '../../components/FormInput';
import Button from '../../components/Button';
import * as saboresService from '../../services/sabores';

export default function FlavorForm() {
  const { id } = useParams();
  const isEdicao = Boolean(id);
  const navigate = useNavigate();

  const [nome, setNome] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    if (isEdicao) {
      (async () => {
        const sabor = await saboresService.getById(id);
        setNome(sabor.nome);
      })();
    }
  }, [id, isEdicao]);

  async function handleSubmit(e) {
    e.preventDefault();
    setErro('');
    setCarregando(true);

    try {
      if (isEdicao) {
        await saboresService.update(id, { nome });
      } else {
        await saboresService.create({ nome });
      }
      navigate('/pizzaiolo/sabores', { replace: true });
    } catch (err) {
      setErro(err.response?.data?.error || 'Erro ao salvar sabor');
    } finally {
      setCarregando(false);
    }
  }

  function handleCancelar() {
    navigate('/pizzaiolo/sabores');
  }

  return (
    <div className="row justify-content-center">
      <div className="col-md-6">
        <h2 className="mb-4">{isEdicao ? 'Editar Sabor' : 'Adicionar Sabor'}</h2>

        {erro && <div className="alert alert-danger">{erro}</div>}

        <form onSubmit={handleSubmit}>
          <FormInput
            label="Nome do Sabor"
            name="nome"
            value={nome}
            onChange={e => setNome(e.target.value)}
            placeholder="Ex: Calabresa"
            error={!nome && 'Informe um nome válido'}
          />

          <div className="d-flex justify-content-end gap-2">
            <Button
              type="button"
              variant="outline-secondary"
              disabled={carregando}
              onClick={handleCancelar}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={carregando}>
              {carregando ? 'Salvando...' : 'Salvar'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}