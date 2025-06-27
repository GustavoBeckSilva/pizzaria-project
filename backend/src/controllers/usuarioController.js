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
  console.log('--- INICIANDO ATUALIZAÇÃO DE PERFIL ---');
  try {
    const { id } = req.params;
    const idToken = req.user.id;
    
    // Log dos dados recebidos
    console.log(`[Controller] ID do parâmetro da rota: ${id}, Tipo: ${typeof id}`);
    console.log(`[Controller] ID do token do usuário: ${idToken}, Tipo: ${typeof idToken}`);
    console.log('[Controller] Dados recebidos no corpo (req.body):', req.body);

    if (Number(id) !== idToken) {
      console.warn('[Controller] AVISO: Tentativa de acesso negada.');
      return res.status(403).json({ message: "Acesso negado. Você só pode atualizar seu próprio perfil." });
    }

    const { nome, email, senha } = req.body;
    const dadosParaAtualizar = {};

    if (nome) dadosParaAtualizar.nome = nome;
    if (email) dadosParaAtualizar.email = email;

    if (senha) {
      console.log('[Controller] Nova senha recebida. Gerando hash...');
      dadosParaAtualizar.senha_hash = await bcrypt.hash(senha, 10);
    }
    
    if (Object.keys(dadosParaAtualizar).length === 0) {
      console.warn('[Controller] AVISO: Nenhum dado fornecido para atualização.');
      return res.status(400).json({ message: "Nenhum dado fornecido para atualização." });
    }

    console.log('[Controller] Objeto a ser enviado para o modelo:', dadosParaAtualizar);
    
    // Chamada ao modelo
    const usuarioAtualizado = await atualizarUsuario(id, dadosParaAtualizar);

    console.log('[Controller] Resposta recebida do modelo:', usuarioAtualizado);

    if (!usuarioAtualizado) {
       console.error('[Controller] ERRO: O modelo retornou undefined. A atualização pode não ter encontrado o ID.');
       throw new Error('Usuário não encontrado para atualização.');
    }

    const { senha_hash, ...usuarioSemSenha } = usuarioAtualizado;

    console.log('[Controller] Enviando resposta de sucesso para o frontend.');
    console.log('--- FIM DA ATUALIZAÇÃO DE PERFIL ---');
    res.status(200).json(usuarioSemSenha);

  } catch (error) {
    console.error('[Controller] ERRO FATAL NO BLOCO CATCH:', error);
    console.log('--- FIM DA ATUALIZAÇÃO DE PERFIL COM ERRO ---');
    res.status(400).json({ message: 'Ocorreu um erro ao atualizar o perfil.' });
  }
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