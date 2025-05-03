// src/controllers/usuarioController.js
const {
    listarUsuarios,
    buscarUsuarioPorId,
    criarUsuario,
    atualizarUsuario,
    removerUsuario
  } = require('../models/usuarioModel');
  
  async function getUsuarios(req, res) {
    try {
      const usuarios = await listarUsuarios();
      res.json(usuarios);
    } catch (err) {
      res.status(500).json({ error: 'Erro ao listar usuários' });
    }
  }
  
  async function getUsuarioById(req, res) {
    try {
      const usuario = await buscarUsuarioPorId(req.params.id);
      if (!usuario) return res.status(404).json({ error: 'Usuário não encontrado' });
      res.json(usuario);
    } catch (err) {
      res.status(500).json({ error: 'Erro ao buscar usuário' });
    }
  }
  
  async function postUsuario(req, res) {
    try {
      const novo = await criarUsuario(req.body);
      res.status(201).json(novo);
    } catch (err) {
      res.status(500).json({ error: 'Erro ao criar usuário' });
    }
  }
  
  async function putUsuario(req, res) {
    try {
      const atualizado = await atualizarUsuario(req.params.id, req.body);
      res.json(atualizado);
    } catch (err) {
      res.status(500).json({ error: 'Erro ao atualizar usuário' });
    }
  }
  
  async function deleteUsuario(req, res) {
    try {
      await removerUsuario(req.params.id);
      res.status(204).end();
    } catch (err) {
      res.status(500).json({ error: 'Erro ao remover usuário' });
    }
  }
  
  module.exports = {
    getUsuarios,
    getUsuarioById,
    postUsuario,
    putUsuario,
    deleteUsuario
  };
  