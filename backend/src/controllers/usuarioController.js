const bcrypt = require('bcrypt');
require('dotenv').config();

const {
  listarUsuarios,
  buscarUsuarioPorId,
  criarUsuario,
  atualizarUsuario,
  removerUsuario
} = require('../models/usuarioModel');

async function postUsuario(req, res) {
  const {
    nome,
    email,
    senha_hash: rawPassword, // aqui vem a senha em texto puro
    tipo_usuario,
    adminSecret
  } = req.body;

  // validação de dados
  if (!nome || !email || !rawPassword || !tipo_usuario) {
    return res.status(400).json({ error: 'Dados incompletos' });
  }

  // se for pizzaiolo, exige o segredo
  if (tipo_usuario === 'pizzaiolo') {
    if (!adminSecret || adminSecret !== process.env.ADMIN_SECRET) {
      return res.status(403).json({ error: 'Código de gerente inválido' });
    }
  }

  try {
    // gera o hash a partir da senha pura
    const hash = await bcrypt.hash(rawPassword, 10);

    // cria usuário com o hash correto
    const novo = await criarUsuario({
      nome,
      email,
      senha_hash: hash,
      tipo_usuario
    });

    return res.status(201).json(novo);
  } catch (err) {
    console.error('Erro ao criar usuário:', err);
    return res.status(500).json({ error: 'Erro ao criar usuário' });
  }
}

async function getUsuarios(req, res) {
  try {
    const usuarios = await listarUsuarios();
    return res.json(usuarios);
  } catch (err) {
    console.error('Erro ao listar usuários:', err);
    return res.status(500).json({ error: 'Erro ao listar usuários' });
  }
}

async function getUsuarioById(req, res) {
  try {
    const usuario = await buscarUsuarioPorId(req.params.id);
    if (!usuario) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    return res.json(usuario);
  } catch (err) {
    console.error('Erro ao buscar usuário:', err);
    return res.status(500).json({ error: 'Erro ao buscar usuário' });
  }
}

const putUsuario = async (req, res) => {
  // --- INÍCIO DA ALTERAÇÃO ---
  // A lógica de atualização foi refeita para corrigir a verificação de
  // permissão e para usar o 'usuarioModel', mantendo a consistência do projeto.
  const { id } = req.params;
  const idToken = req.user.id;

  // Garante que o usuário logado só pode atualizar o próprio perfil
  if (Number(id) !== idToken) {
    return res.status(403).json({ message: "Acesso negado. Você só pode atualizar seu próprio perfil." });
  }

  const { nome, email, senha } = req.body;
  const dadosParaAtualizar = {};

  // Adiciona os campos ao objeto de atualização apenas se eles forem fornecidos na requisição
  if (nome) dadosParaAtualizar.nome = nome;
  if (email) dadosParaAtualizar.email = email;

  // Se uma nova senha for enviada, gera o hash para ser salvo na base de dados
  if (senha) {
    dadosParaAtualizar.senha_hash = await bcrypt.hash(senha, 10);
  }
  
  // Verifica se há de facto dados para atualizar
  if (Object.keys(dadosParaAtualizar).length === 0) {
    return res.status(400).json({ message: "Nenhum dado fornecido para atualização." });
  }

  try {
    // Usa a função 'atualizarUsuario' do model, em vez de 'prisma'
    const usuarioAtualizado = await atualizarUsuario(id, dadosParaAtualizar);
    
    // Remove o hash da senha da resposta para não expor essa informação
    const { senha_hash, ...usuarioSemSenha } = usuarioAtualizado;

    res.status(200).json(usuarioSemSenha);
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    res.status(400).json({ message: 'Erro ao atualizar o perfil.' });
  }
  // --- FIM DA ALTERAÇÃO ---
};

async function deleteUsuario(req, res) {
  try {
    await removerUsuario(req.params.id);
    return res.status(204).end();
  } catch (err) {
    console.error('Erro ao remover usuário:', err);
    return res.status(500).json({ error: 'Erro ao remover usuário' });
  }
}

module.exports = {
  postUsuario,
  getUsuarios,
  getUsuarioById,
  putUsuario,
  deleteUsuario
};