// src/pages/Cliente/CarrinhoPage.jsx
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CarrinhoContext } from '../../context/CarrinhoContext';
import * as saboresService from '../../services/sabores';
import Button from '../../components/Button';
import { formatarPreco } from '../../utils/formatadores';

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
      .map(id => sabores.find(s => s.id === id)?.nome || '—')
      .join(', ');
  }

  function subtotal(pizza) {
    return pizza.precoUnit * pizza.quantidade;
  }

  const total = itens.reduce((acc, pizza) => acc + subtotal(pizza), 0);

  return (
    <div>
      <h2 className="mb-4">Carrinho</h2>

      {itens.length === 0 ? (
        <p>Seu carrinho está vazio.</p>
      ) : (
        <>
          <table className="table">
            <thead>
              <tr>
                <th>#</th>
                <th>Tamanho</th>
                <th>Sabores</th>
                <th>Qtd</th>
                <th>Preço unit.</th>
                <th>Subtotal</th>
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
                  <td>{formatarPreco(pizza.precoUnit)}</td>
                  <td>{formatarPreco(subtotal(pizza))}</td>
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
            <tfoot>
              <tr>
                <th colSpan="5" className="text-end">Total:</th>
                <th>{formatarPreco(total)}</th>
                <th></th>
              </tr>
            </tfoot>
          </table>

          <div className="text-end">
            <Button onClick={() => navigate('/cliente/checkout')}>
              Finalizar Pedido
            </Button>
          </div>
        </>
      )}
    </div>
);
}
