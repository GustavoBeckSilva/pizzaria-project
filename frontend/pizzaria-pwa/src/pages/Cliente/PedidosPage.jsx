import React, { useEffect, useState } from 'react';
import * as pedidosService from '../../services/pedidos';
import { formatarData } from '../../utils/formatadores';

export default function PedidosPage() {
  const [pedidos, setPedidos] = useState([]);

  useEffect(() => {
    (async () => {
      setPedidos(await pedidosService.getUserOrders());
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
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Status</th>
              <th>Criado em</th>
            </tr>
          </thead>
          <tbody>
            {pedidos.map(p => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>
                  <span className={`badge bg-${badgeStatus(p.status)}`}>
                    {p.status}
                  </span>
                </td>
                <td>{formatarData(p.criado_em)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
