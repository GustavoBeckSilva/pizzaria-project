import React, { useEffect, useState } from 'react';
import * as pedidosService from '../../services/pedidos';
import * as pizzasService from '../../services/pizzas';
import * as saboresService from '../../services/sabores';
import { formatarData, formatarPreco } from '../../utils/formatadores';
import { PRECO_POR_TAMANHO } from '../../utils/constantes';

export default function PedidosPage() {
  const [pedidos, setPedidos] = useState([]);
  const [sabores, setSabores] = useState([]);

  useEffect(() => {
    (async () => {
      // Carrega lista global de sabores (id → nome)
      const listaSabores = await saboresService.getAll();
      setSabores(listaSabores);

      // 1. Buscar metadados dos pedidos do usuário
      const lista = await pedidosService.getUserOrders();

      // 2. Para cada pedido, buscar pizzas e enriquecer com nomes e preço
      
      const detalhados = await Promise.all(
        lista.map(async (p) => {
          const pizzasRaw = await pizzasService.getByPedidoId(p.id);
          
          // mapeia cada pizza:
          const pizzas = pizzasRaw.map((pz) => {
            // preço unitário baseado em tamanho
            const key = String(pz.tamanho).trim();
            const precoUnit = PRECO_POR_TAMANHO[key] ?? 0;

            const nomesSabores = (pz.sabores || []).map((id) => {
              const s = listaSabores.find((s) => s.id === id);
              return s ? s.nome : '—';
            });

            return {
              ...pz,
              precoUnit,
              nomesSabores,
            };
          });

          return { ...p, pizzas };
        })
      );

      setPedidos(detalhados);
    })();
  }, []);

  function badgeStatus(status) {
    const map = {
      pendente: 'secondary',
      preparando: 'warning',
      pronta: 'success',
    };
    return map[status] || 'dark';
  }

  return (
    <div>
      <h2 className="mb-4">Meus Pedidos</h2>

      {pedidos.length === 0 ? (
        <p>Você não tem pedidos ainda.</p>
      ) : (
        <div className="d-flex flex-column gap-3">
          {pedidos.map((p) => {
            // total do pedido
            const total = p.pizzas.reduce(
              (acc, pizza) => acc + pizza.precoUnit * pizza.quantidade,
              0
            );

            return (
              <div key={p.id} className="card">
                <div className="card-header d-flex justify-content-between align-items-center">
                  <span><strong>Pedido #{p.id}</strong></span>
                  <span className={`badge bg-${badgeStatus(p.status)}`}>
                    {p.status}
                  </span>
                </div>

                <div className="card-body">
                  <p className="mb-2">
                    <strong>Data:</strong> {formatarData(p.criado_em)}
                  </p>

                  {p.pizzas.map((pizza, i) => (
                    <div
                      key={i}
                      className="border rounded p-3 mb-2 bg-light"
                    >
                      <div className="d-flex justify-content-between">
                        <div>
                          <strong>
                            {pizza.quantidade}× Pizza {pizza.tamanho}
                          </strong>
                          {' — '}
                          <small>{formatarPreco(pizza.precoUnit)} cada</small>
                        </div>
                        <div>
                          <strong>
                            {formatarPreco(pizza.precoUnit * pizza.quantidade)}
                          </strong>
                        </div>
                      </div>
                      <p className="mb-0">
                        <small>
                          Sabores: {pizza.nomesSabores.join(', ')}
                        </small>
                      </p>
                    </div>
                  ))}
                </div>

                <div className="card-footer text-end">
                  <strong>Total: {formatarPreco(total)}</strong>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}