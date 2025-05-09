// src/pages/Cliente/CheckoutPage.jsx
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CarrinhoContext } from '../../context/CarrinhoContext';
import * as saboresService from '../../services/sabores';
import Button from '../../components/Button';
import { formatarPreco } from '../../utils/formatadores';
import * as pedidosService from '../../services/pedidos';
import * as pizzasService from '../../services/pizzas';

export default function CheckoutPage() {
  const { itens, limparCarrinho } = useContext(CarrinhoContext);
  const [sabores, setSabores] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const lista = await saboresService.getAll();
      setSabores(lista);
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

  async function handleConfirm() {
    setCarregando(true);
    try {
      const pedido = await pedidosService.create();
      for (const pizza of itens) {
        await pizzasService.addPizza(pedido.id, pizza);
      }
      limparCarrinho();
      navigate('/cliente/pedidos', { replace: true });
    } catch (err) {
      alert('Erro ao finalizar pedido.');
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div>
      <h2 className="mb-4">Checkout</h2>

      {itens.map((pizza, i) => (
        <div key={i} className="card mb-3">
          <div className="card-body">
            <h5 className="card-title">
              {pizza.quantidade} × Pizza {pizza.tamanho} —{' '}
              <strong>{formatarPreco(pizza.precoUnit)}</strong> cada
            </h5>
            <p className="card-text">
              Sabores: {nomeSabores(pizza.sabores)}
            </p>
            <p className="card-text">
              Subtotal: <strong>{formatarPreco(subtotal(pizza))}</strong>
            </p>
          </div>
        </div>
      ))}

      <div className="mb-4 text-end">
        <h4>Total: {formatarPreco(total)}</h4>
      </div>

      <div className="text-center">
        <Button onClick={handleConfirm} disabled={carregando}>
          {carregando ? 'Enviando pedido...' : 'Confirmar Pedido'}
        </Button>
      </div>
    </div>
  );
}
