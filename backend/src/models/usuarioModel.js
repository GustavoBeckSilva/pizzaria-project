// src/models/usuarioModel.js
const db = require('../config/db');

async function listarUsuarios() {
  const res = await db.query(`
    SELECT id, nome, email, tipo_usuario, criado_em, atualizado_em
    FROM tb_usuarios
    ORDER BY nome
  `);
  return res.rows;
}

async function buscarUsuarioPorId(id) {
  const res = await db.query(
    `SELECT id, nome, email, tipo_usuario, criado_em, atualizado_em
     FROM tb_usuarios
     WHERE id = $1`,
    [id]
  );
  return res.rows[0];
}

async function buscarUsuarioPorEmail(email) {
  const res = await db.query(
    `SELECT id, nome, email, senha_hash, tipo_usuario, criado_em, atualizado_em
     FROM tb_usuarios
     WHERE email = $1`,
    [email]
  );
  return res.rows[0];
}

async function criarUsuario({ nome, email, senha_hash, tipo_usuario }) {
  const res = await db.query(
    `INSERT INTO tb_usuarios (nome, email, senha_hash, tipo_usuario)
     VALUES ($1, $2, $3, $4)
     RETURNING id, nome, email, tipo_usuario, criado_em, atualizado_em`,
    [nome, email, senha_hash, tipo_usuario]
  );
  return res.rows[0];
}

async function atualizarUsuario(id, campos) {
  console.log('[Model] Função atualizarUsuario chamada com ID:', id, 'e campos:', campos);

  const cols = Object.keys(campos);
  const vals = Object.values(campos);
  const set = cols.map((c, i) => `${c} = $${i + 1}`).join(', ');
  
  const queryText = `UPDATE tb_usuarios SET ${set} WHERE id = $${cols.length + 1} RETURNING id, nome, email, tipo_usuario, criado_em, atualizado_em`;
  const queryValues = [...vals, id];

  console.log('[Model] Executando a query SQL:', queryText);
  console.log('[Model] Com os valores:', queryValues);

  try {
    const res = await db.query(queryText, queryValues);
    
    // Log importante para ver o que a base de dados realmente retornou
    console.log(`[Model] Query executada com sucesso. ${res.rowCount} linha(s) afetada(s).`);
    console.log('[Model] Dados retornados pela base de dados (res.rows[0]):', res.rows[0]);

    return res.rows[0];
  } catch (error) {
    console.error('[Model] ERRO ao executar a query de atualização:', error);
    throw error; // Propaga o erro para o controller
  }
}

async function removerUsuario(id) {
  await db.query(
    `DELETE FROM tb_usuarios WHERE id = $1`,
    [id]
  );
}

module.exports = {
  listarUsuarios,
  buscarUsuarioPorId,
  buscarUsuarioPorEmail,
  criarUsuario,
  atualizarUsuario,
  removerUsuario
};
