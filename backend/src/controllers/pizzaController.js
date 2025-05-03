// src/controllers/pizzaController.js
const {
    listarPizzasPorPedido,
    criarPizza,
    atualizarPizza,
    removerPizza
  } = require('../models/pizzaModel');
  
  async function getPizzas(req, res) {
    try {
      const pizzas = await listarPizzasPorPedido(req.params.pedidoId);
      res.json(pizzas);
    } catch (err) {
      res.status(500).json({ error: 'Erro ao listar pizzas' });
    }
  }
  
  async function postPizza(req, res) {
    try {
      const dados = { ...req.body, pedido_id: req.params.pedidoId };
      const nova = await criarPizza(dados);
      res.status(201).json(nova);
    } catch (err) {
      res.status(500).json({ error: 'Erro ao criar pizza' });
    }
  }
  
  async function putPizza(req, res) {
    try {
      const atualizado = await atualizarPizza(req.params.pizzaId, req.body);
      res.json(atualizado);
    } catch (err) {
      res.status(500).json({ error: 'Erro ao atualizar pizza' });
    }
  }
  
  async function deletePizza(req, res) {
    try {
      await removerPizza(req.params.pizzaId);
      res.status(204).end();
    } catch (err) {
      res.status(500).json({ error: 'Erro ao remover pizza' });
    }
  }
  
  module.exports = {
    getPizzas,
    postPizza,
    putPizza,
    deletePizza
  };
  