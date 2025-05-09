// src/pages/Pizzaiolo/DashboardPage.jsx
import React, { useEffect, useState } from 'react';
import * as pedidosService from '../../services/pedidos';
import * as usuariosService from '../../services/usuarios';
import * as pizzasService from '../../services/pizzas';
import * as saboresService from '../../services/sabores';
import { formatarData, formatarPreco } from '../../utils/formatadores';
import { PRECO_POR_TAMANHO } from '../../utils/constantes';
import ModalPedido from '../../components/ModalPedido';

export default function DashboardPage() {
  const [pedidos, setPedidos] = useState([]);
  const [usuariosMap, setUsuariosMap] = useState({});
  const [saboresMap, setSaboresMap] = useState({});
  const [pedidoSelecionado, setPedidoSelecionado] = useState(null);
  const [carregando, setCarregando] = useState(false);
  const [expandidoId, setExpandidoId] = useState(null);

  useEffect(() => {
    async function init() {
      // Carrega usuários e sabores
      const [usuarios, sabores] = await Promise.all([
        usuariosService.getAll(),
        saboresService.getAll(),
      ]);
      const uMap = Object.fromEntries(usuarios.map(u => [u.id, u.nome]));
      const sMap = Object.fromEntries(sabores.map(s => [s.id, s.nome]));
      setUsuariosMap(uMap);
      setSaboresMap(sMap);

      // Carrega pedidos com detalhes
      const lista = await pedidosService.getAll();
      const detalhados = await Promise.all(
        lista.map(async p => {
          const pizzasRaw = await pizzasService.getByPedidoId(p.id);
          const pizzas = pizzasRaw.map(pz => ({
            ...pz,
            nomesSabores: (pz.sabores || []).map(id => sMap[id] || '—'),
            precoUnit: PRECO_POR_TAMANHO[String(pz.tamanho).trim()] || 0
          }));
          return {
            ...p,
            clienteNome: uMap[p.usuario_id] || '—',
            pizzas
          };
        })
      );

      detalhados.sort((a, b) => new Date(b.criado_em) - new Date(a.criado_em));
      setPedidos(detalhados);
    }
    init();
  }, []);

  async function handleSalvar(pedidoId, novoStatus) {
    setCarregando(true);
    try {
      await pedidosService.updateStatus(pedidoId, novoStatus);
      setPedidoSelecionado(null);
      setPedidos(prev => prev.map(p => p.id === pedidoId ? { ...p, status: novoStatus } : p));
    } finally {
      setCarregando(false);
    }
  }

  function toggleExpand(id) {
    setExpandidoId(expandidoId === id ? null : id);
  }

  return (
    <div>
      <h2 className="mb-4">Painel de Pedidos</h2>
      <table className="table table-hover align-middle">
        <thead className="table-light">
          <tr>
            <th>ID</th>
            <th>Cliente</th>
            <th>Status</th>
            <th>Criado em</th>
            <th className="text-center">Ações</th>
          </tr>
        </thead>
        <tbody>
          {pedidos.map(p => (
            <React.Fragment key={p.id}>
              <tr>
                <td>{p.id}</td>
                <td>{p.clienteNome}</td>
                <td>
                  <span
                    className={`badge bg-${
                      p.status === 'pendente'
                        ? 'secondary'
                        : p.status === 'preparando'
                        ? 'warning'
                        : 'success'
                    }`}
                  >
                    {p.status}
                  </span>
                </td>
                <td>{formatarData(p.criado_em)}</td>
                <td className="text-center">
                  <button
                    className="btn btn-sm btn-outline-info me-2"
                    onClick={() => toggleExpand(p.id)}
                  >
                    {expandidoId === p.id ? 'Ocultar Detalhes' : 'Detalhes'}
                  </button>
                  <button
                    className="btn btn-sm btn-outline-primary"
                    onClick={() => setPedidoSelecionado(p)}
                  >
                    Editar Status
                  </button>
                </td>
              </tr>
              {expandidoId === p.id && (
                <tr>
                  <td colSpan="5">
                    <div className="card shadow-sm p-3 mb-3">
                      <h6>Detalhes do Pedido</h6>
                      {p.pizzas.map((pz, i) => (
                        <div
                          key={i}
                          className="d-flex justify-content-between mb-2"
                        >
                          <div>
                            {pz.quantidade}× Pizza {pz.tamanho} — Sabores:{' '}
                            {pz.nomesSabores.join(', ')}
                          </div>
                          <div>{formatarPreco(pz.precoUnit * pz.quantidade)}</div>
                        </div>
                      ))}
                      <hr />
                      <div className="text-end">
                        <strong>
                          Total: {' '}
                          {formatarPreco(
                            p.pizzas.reduce(
                              (sum, x) => sum + x.precoUnit * x.quantidade,
                              0
                            )
                          )}
                        </strong>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>

      <ModalPedido
        exibir={!!pedidoSelecionado}
        pedido={pedidoSelecionado}
        aoFechar={() => setPedidoSelecionado(null)}
        aoSalvar={handleSalvar}
        carregando={carregando}
      />
    </div>
  );
}