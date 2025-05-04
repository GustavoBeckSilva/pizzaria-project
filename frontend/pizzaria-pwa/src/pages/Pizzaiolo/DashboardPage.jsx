import React, { useEffect, useState } from 'react';
import * as pedidosService from '../../services/pedidos';
import { formatarData } from '../../utils/formatadores';

export default function DashboardPage() {
  const [pedidos, setPedidos] = useState([]);
  const [atualizando, setAtualizando] = useState(null);

  useEffect(() => {
    carregarPedidos();
  }, []);

  async function carregarPedidos() {
    const lista = await pedidosService.getAll();

    const ordenados = lista.sort((a, b) => 
      new Date(b.criado_em) - new Date(a.criado_em)
    );
    setPedidos(ordenados);
  }

  async function handleStatusChange(pedidoId, novoStatus) {
    setAtualizando(pedidoId);
    try {
      await pedidosService.updateStatus(pedidoId, novoStatus);
      setPedidos(pedidos.map(p =>
        p.id === pedidoId ? { ...p, status: novoStatus } : p
      ));
    } finally {
      setAtualizando(null);
    }
  }

  return (
    <div>
      <h2 className="mb-4">Lista de Pedidos</h2>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>ID</th>
            <th>Cliente (ID)</th>
            <th>Status</th>
            <th>Criado em</th>
          </tr>
        </thead>
        <tbody>
          {pedidos.map(pedido => (
            <tr key={pedido.id}>
              <td>{pedido.id}</td>
              <td>{pedido.usuario_id}</td>
              <td>
                <select
                  className="form-select"
                  value={pedido.status}
                  onChange={e => handleStatusChange(pedido.id, e.target.value)}
                  disabled={atualizando === pedido.id}
                >
                  <option value="pendente">Pendente</option>
                  <option value="preparando">Preparando</option>
                  <option value="pronta">Pronta</option>
                </select>
              </td>
              <td>{formatarData(pedido.criado_em)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}