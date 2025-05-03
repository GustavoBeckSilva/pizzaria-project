// src/controllers/saborController.js
const {
    listarSabores,
    buscarSaborPorId,
    criarSabor,
    atualizarSabor,
    removerSabor
  } = require('../models/saborModel');
  
  async function getSabores(req, res) {
    try {
      const sabores = await listarSabores();
      res.json(sabores);
    } catch (err) {
      res.status(500).json({ error: 'Erro ao listar sabores' });
    }
  }
  
  async function getSaborById(req, res) {
    try {
      const sabor = await buscarSaborPorId(req.params.id);
      if (!sabor) return res.status(404).json({ error: 'Sabor não encontrado' });
      res.json(sabor);
    } catch (err) {
      res.status(500).json({ error: 'Erro ao buscar sabor' });
    }
  }
  
  async function postSabor(req, res) {
    try {
      const novo = await criarSabor(req.body.nome);
      res.status(201).json(novo);
    } catch (err) {
      res.status(500).json({ error: 'Erro ao criar sabor' });
    }
  }
  
  async function putSabor(req, res) {
    try {
      const atualizado = await atualizarSabor(req.params.id, req.body.nome);
      res.json(atualizado);
    } catch (err) {
      res.status(500).json({ error: 'Erro ao atualizar sabor' });
    }
  }
  
  async function deleteSabor(req, res) {
    try {
      await removerSabor(req.params.id);
      res.status(204).end();
    } catch (err) {
      res.status(500).json({ error: 'Erro ao remover sabor' });
    }
  }
  
  module.exports = {
    getSabores,
    getSaborById,
    postSabor,
    putSabor,
    deleteSabor
  };
  