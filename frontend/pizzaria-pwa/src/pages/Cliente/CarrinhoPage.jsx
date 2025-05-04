import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CarrinhoContext } from '../../context/CarrinhoContext';
import * as saboresService from '../../services/sabores';
import Button from '../../components/Button';

export default function CarrinhoPage() {
  const { itens, removerPizza } = useContext(CarrinhoContext);
  const [sabores, setSabores] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      setSabores(await saboresService.getAll());
    })();
  }, []);

  function nomeSabores(ids) {
    return ids
      .map(id => sabores.find(s => s.id === id)?.nome || '---')
      .join(', ');
  }

  return (
    <div>
      <h2 className="mb-4">Carrinho</h2>
      {itens.length === 0 ? (
        <p>Seu carrinho está vazio.</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>#</th>
              <th>Tamanho</th>
              <th>Sabores</th>
              <th>Qtd</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {itens.map((pizza, idx) => (
              <tr key={idx}>
                <td>{idx + 1}</td>
                <td>{pizza.tamanho}</td>
                <td>{nomeSabores(pizza.sabores)}</td>
                <td>{pizza.quantidade}</td>
                <td>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => removerPizza(idx)}
                  >
                    Remover
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {itens.length > 0 && (
        <Button onClick={() => navigate('/cliente/checkout')}>
          Finalizar Pedido
        </Button>
      )}
    </div>
  );
}
