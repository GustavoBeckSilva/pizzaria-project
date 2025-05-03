const {
  listarPizzasPorPedido,
  criarPizza,
  atualizarPizza,
  removerPizza
} = require('../models/pizzaModel');

async function getPizzas(req, res) {
  try {
    const pizzas = await listarPizzasPorPedido(req.params.pedidoId);
    return res.json(pizzas);
  } catch (err) {
    console.error('Erro ao listar pizzas:', err);
    return res.status(500).json({ error: 'Erro ao listar pizzas', details: err.message });
  }
}

async function postPizza(req, res) {
  try {
    const { tamanho, sabores, quantidade } = req.body;
    const dados = { pedido_id: req.params.pedidoId, tamanho, sabor_ids: sabores, quantidade };
    const nova = await criarPizza(dados);
    return res.status(201).json(nova);
  } catch (err) {
    console.error('Erro interno ao criar pizza:', err);
    return res.status(500).json({ error: 'Erro ao criar pizza', details: err.message });
  }
}

async function putPizza(req, res) {
  try {
    const campos = { ...req.body };
    if (campos.sabores) {
      campos.sabor_ids = campos.sabores;
      delete campos.sabores;
    }
    const atualizado = await atualizarPizza(req.params.pizzaId, campos);
    return res.json(atualizado);
  } catch (err) {
    console.error('Erro interno ao atualizar pizza:', err);
    return res.status(500).json({ error: 'Erro ao atualizar pizza', details: err.message });
  }
}

async function deletePizza(req, res) {
  try {
    await removerPizza(req.params.pizzaId);
    return res.status(204).end();
  } catch (err) {
    console.error('Erro interno ao remover pizza:', err);
    return res.status(500).json({ error: 'Erro ao remover pizza', details: err.message });
  }
}

module.exports = {
  getPizzas,
  postPizza,
  putPizza,
  deletePizza
};
