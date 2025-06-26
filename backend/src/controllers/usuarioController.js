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
    senha_hash: rawPassword,   // aqui vem a senha em texto puro
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
    const { id } = req.params;
    const idToken = req.userId;

    if (Number(id) !== idToken) 
        return res.status(403).json({ message: "Acesso negado. Você só pode atualizar seu próprio perfil." });
    
    try {
        const usuario = await prisma.usuario.update({
            where: { id: Number(id) },
            data: req.body,
        });
        const { senha: _, ...usuarioSemSenha } = usuario;
        res.status(200).json(usuarioSemSenha);
    } catch (error) {
        res.status(400).json({ message: error.message });
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
