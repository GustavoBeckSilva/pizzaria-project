// src/models/pedidoModel.js
const db = require('../config/db');

async function listarPedidos(usuarioId = null) {
  let sql = `
    SELECT id, usuario_id, status, criado_em, atualizado_em
    FROM tb_pedidos
  `;
  const params = [];
  if (usuarioId) {
    sql += ' WHERE usuario_id = $1';
    params.push(usuarioId);
  }
  sql += ' ORDER BY criado_em DESC';
  const res = await db.query(sql, params);
  return res.rows;
}

async function buscarPedidoPorId(id) {
  const res = await db.query(
    `SELECT id, usuario_id, status, criado_em, atualizado_em
     FROM tb_pedidos
     WHERE id = $1`,
    [id]
  );
  return res.rows[0];
}

async function criarPedido(usuarioId) {
  const res = await db.query(
    `INSERT INTO tb_pedidos (usuario_id)
     VALUES ($1)
     RETURNING id, usuario_id, status, criado_em, atualizado_em`,
    [usuarioId]
  );
  return res.rows[0];
}

async function atualizarStatusPedido(id, status) {
  const res = await db.query(
    `UPDATE tb_pedidos
     SET status = $1
     WHERE id = $2
     RETURNING id, usuario_id, status, criado_em, atualizado_em`,
    [status, id]
  );
  return res.rows[0];
}

async function removerPedido(id) {
  await db.query(
    `DELETE FROM tb_pedidos WHERE id = $1`,
    [id]
  );
}

module.exports = {
  listarPedidos,
  buscarPedidoPorId,
  criarPedido,
  atualizarStatusPedido,
  removerPedido
};
