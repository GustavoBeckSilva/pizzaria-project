import React, { useState, useEffect } from 'react';
import { formatarData } from '../utils/formatadores';

export default function ModalPedido({ exibir, pedido, aoFechar, aoSalvar, carregando }) {
  const [statusNovo, setStatusNovo] = useState('');

  useEffect(() => {
    if (pedido) setStatusNovo(pedido.status);
  }, [pedido]);

  if (!exibir || !pedido) return null;

  return (
    <div className="modal-body">
      <div className="modal d-block" tabIndex="-1" role="dialog">
        <div className="modal-dialog modal-sm" role="document">
          <div className="modal-content rounded-2 shadow-lg">
            <div className="modal-header">
              <h5 className="modal-title">Alterar Status</h5>
              <button
                type="button"
                className="btn-close"
                aria-label="Fechar"
                onClick={aoFechar}
                disabled={carregando}
              ></button>
            </div>
            <div className="modal-body">
              <p><strong>Pedido #{pedido.id}</strong></p>
              <select
                className="form-select my-2"
                value={statusNovo}
                onChange={e => setStatusNovo(e.target.value)}
              >
                <option value="pendente">Pendente</option>
                <option value="preparando">Preparando</option>
                <option value="pronta">Pronta</option>
              </select>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={aoFechar}
                disabled={carregando}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => aoSalvar(pedido.id, statusNovo)}
                disabled={carregando || statusNovo === pedido.status}
              >
                {carregando ? 'Salvando...' : 'Salvar'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}