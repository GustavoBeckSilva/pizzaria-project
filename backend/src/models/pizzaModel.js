// src/models/pizzaModel.js
const db = require('../config/db');

async function listarPizzasPorPedido(pedidoId) {
  const res = await db.query(
    `SELECT id, pedido_id, tamanho, sabores, quantidade, criado_em, atualizado_em
     FROM tb_pizzas
     WHERE pedido_id = $1
     ORDER BY id`,
    [pedidoId]
  );
  return res.rows;
}

async function criarPizza({ pedido_id, tamanho, sabores, quantidade }) {
  const res = await db.query(
    `INSERT INTO tb_pizzas (pedido_id, tamanho, sabores, quantidade)
     VALUES ($1, $2, $3, $4)
     RETURNING id, pedido_id, tamanho, sabores, quantidade, criado_em, atualizado_em`,
    [pedido_id, tamanho, sabores, quantidade]
  );
  return res.rows[0];
}

async function atualizarPizza(id, campos) {
  const cols = Object.keys(campos);
  const vals = Object.values(campos);
  const set = cols.map((c, i) => `${c} = $${i + 1}`).join(', ');
  const res = await db.query(
    `UPDATE tb_pizzas SET ${set} WHERE id = $${cols.length + 1}
     RETURNING id, pedido_id, tamanho, sabores, quantidade, criado_em, atualizado_em`,
    [...vals, id]
  );
  return res.rows[0];
}

async function removerPizza(id) {
  await db.query(
    `DELETE FROM tb_pizzas WHERE id = $1`,
    [id]
  );
}

module.exports = {
  listarPizzasPorPedido,
  criarPizza,
  atualizarPizza,
  removerPizza
};
