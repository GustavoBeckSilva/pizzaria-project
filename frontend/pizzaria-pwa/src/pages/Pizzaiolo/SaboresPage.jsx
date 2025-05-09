import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as saboresService from '../../services/sabores';
import { formatarData } from '../../utils/formatadores';
import Button from '../../components/Button';

export default function SaboresPage() {
  const [sabores, setSabores] = useState([]);
  const [confirmId, setConfirmId] = useState(null);
  const [carregandoId, setCarregandoId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    carregarSabores();
  }, []);

  async function carregarSabores() {
    const lista = await saboresService.getAll();
    setSabores(lista);
  }

  function handleAdicionar() {
    navigate('/pizzaiolo/sabores/novo');
  }

  function iniciarConfirmacao(id) {
    setConfirmId(id);
  }

  function cancelarConfirmacao() {
    setConfirmId(null);
  }

  async function confirmarDelecao(id) {
    setCarregandoId(id);
    try {
      await saboresService.remove(id);
      setSabores(sabores.filter(s => s.id !== id));
    } finally {
      setCarregandoId(null);
      setConfirmId(null);
    }
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Gerenciar Sabores</h2>
        <Button onClick={handleAdicionar}>Adicionar Sabor</Button>
      </div>

      <table className="table table-hover">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Criado</th>
            <th>Atualizado</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {sabores.map(sabor => (
            <tr key={sabor.id}>
              <td>{sabor.id}</td>
              <td>{sabor.nome}</td>
              <td>{formatarData(sabor.criado_em)}</td>
              <td>{formatarData(sabor.atualizado_em)}</td>
              <td>
                <Button
                  variant="outline-secondary"
                  size="sm"
                  className="me-2"
                  onClick={() => navigate(`/pizzaiolo/sabores/${sabor.id}`)}
                >
                  Editar
                </Button>

                {confirmId === sabor.id ? (
                  <>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      className="me-2"
                      disabled={carregandoId === sabor.id}
                      onClick={() => confirmarDelecao(sabor.id)}
                    >
                      {carregandoId === sabor.id ? 'Excluindo...' : 'Confirmar'}
                    </Button>
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      onClick={cancelarConfirmacao}
                    >
                      Cancelar
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => iniciarConfirmacao(sabor.id)}
                  >
                    Excluir
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
