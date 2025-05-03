// src/controllers/pedidoController.js
const {
    listarPedidos,
    buscarPedidoPorId,
    criarPedido,
    atualizarStatusPedido,
    removerPedido
  } = require('../models/pedidoModel');
  
  async function getPedidos(req, res) {
    try {
      const pedidos = await listarPedidos(req.user.id);
      res.json(pedidos);
    } catch (err) {
      res.status(500).json({ error: 'Erro ao listar pedidos' });
    }
  }
  
  async function getPedidoById(req, res) {
    try {
      const pedido = await buscarPedidoPorId(req.params.id);
      if (!pedido) return res.status(404).json({ error: 'Pedido não encontrado' });
      res.json(pedido);
    } catch (err) {
      res.status(500).json({ error: 'Erro ao buscar pedido' });
    }
  }
  
  async function postPedido(req, res) {
    try {
      const novo = await criarPedido(req.user.id);
      res.status(201).json(novo);
    } catch (err) {
      res.status(500).json({ error: 'Erro ao criar pedido' });
    }
  }
  
  async function patchPedidoStatus(req, res) {
    try {
      const atualizado = await atualizarStatusPedido(req.params.id, req.body.status);
      res.json(atualizado);
    } catch (err) {
      res.status(500).json({ error: 'Erro ao atualizar status do pedido' });
    }
  }
  
  async function deletePedido(req, res) {
    try {
      await removerPedido(req.params.id);
      res.status(204).end();
    } catch (err) {
      res.status(500).json({ error: 'Erro ao remover pedido' });
    }
  }
  
  module.exports = {
    getPedidos,
    getPedidoById,
    postPedido,
    patchPedidoStatus,
    deletePedido
  };
  