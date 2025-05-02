// src/models/saborModel.js
const db = require('../config/db');

async function listarSabores() {
  const res = await db.query(
    `SELECT id, nome, criado_em, atualizado_em
     FROM tb_sabores
     ORDER BY nome`
  );
  return res.rows;
}

async function buscarSaborPorId(id) {
  const res = await db.query(
    `SELECT id, nome, criado_em, atualizado_em
     FROM tb_sabores
     WHERE id = $1`,
    [id]
  );
  return res.rows[0];
}

async function criarSabor(nome) {
  const res = await db.query(
    `INSERT INTO tb_sabores (nome)
     VALUES ($1)
     RETURNING id, nome, criado_em, atualizado_em`,
    [nome]
  );
  return res.rows[0];
}

async function atualizarSabor(id, nome) {
  const res = await db.query(
    `UPDATE tb_sabores
     SET nome = $1
     WHERE id = $2
     RETURNING id, nome, criado_em, atualizado_em`,
    [nome, id]
  );
  return res.rows[0];
}

async function removerSabor(id) {
  await db.query(
    `DELETE FROM tb_sabores WHERE id = $1`,
    [id]
  );
}

module.exports = {
  listarSabores,
  buscarSaborPorId,
  criarSabor,
  atualizarSabor,
  removerSabor
};
