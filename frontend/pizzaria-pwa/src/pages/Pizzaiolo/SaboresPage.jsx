import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as saboresService from '../../services/sabores';
import { formatarData } from '../../utils/formatadores';
import Button from '../../components/Button';

export default function SaboresPage() {
  const [sabores, setSabores] = useState([]);
  const [deletando, setDeletando] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    carregarSabores();
  }, []);

  async function carregarSabores() {
    const lista = await saboresService.getAll();
    setSabores(lista);
  }

  async function handleDeletar(id) {
    if (!window.confirm('Confirma exclusão deste sabor?')) return;
    setDeletando(id);
    try {
      await saboresService.remove(id);
      setSabores(sabores.filter(s => s.id !== id));
    } finally {
      setDeletando(null);
    }
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Gerenciar Sabores</h2>
        <Button onClick={() => navigate('/pizzaiolo/sabores/novo')}>
          Adicionar Sabor
        </Button>
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
                <button
                  className="btn btn-sm btn-secondary me-2"
                  onClick={() => navigate(`/pizzaiolo/sabores/${sabor.id}`)}
                >
                  Editar
                </button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => handleDeletar(sabor.id)}
                  disabled={deletando === sabor.id}
                >
                  {deletando === sabor.id ? 'Excluindo...' : 'Excluir'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
