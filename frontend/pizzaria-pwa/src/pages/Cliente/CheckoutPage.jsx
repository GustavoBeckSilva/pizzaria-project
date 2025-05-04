// src/pages/Cliente/CheckoutPage.jsx
import React, { useContext, useState, useEffect } from 'react';  // <-- inclui useEffect
import { useNavigate } from 'react-router-dom';
import { CarrinhoContext } from '../../context/CarrinhoContext';
import * as pedidosService from '../../services/pedidos';
import * as pizzasService from '../../services/pizzas';
import * as saboresService from '../../services/sabores';
import Button from '../../components/Button';

export default function CheckoutPage() {
  const { itens, limparCarrinho } = useContext(CarrinhoContext);

  // 1) Estado para lista de sabores com nomes
  const [sabores, setSabores] = useState([]);

  // 2) Carrega todos os sabores só uma vez
  useEffect(() => {
    (async () => {
      const lista = await saboresService.getAll();
      setSabores(lista);
    })();
  }, []);

  const [carregando, setCarregando] = useState(false);
  const navigate = useNavigate();

  // 3) Função para mapear IDs -> nomes
  function nomesDosSabores(ids) {
    return ids
      .map(id => sabores.find(s => s.id === id)?.nome || '—')
      .join(', ');
  }

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
              {pizza.quantidade} × Pizza {pizza.tamanho}
            </h5>
            <p className="card-text">
              Sabores: {nomesDosSabores(pizza.sabores)}
            </p>
          </div>
        </div>
      ))}
      <Button onClick={handleConfirm} disabled={carregando}>
        {carregando ? 'Enviando pedido...' : 'Confirmar Pedido'}
      </Button>
    </div>
  );
}
