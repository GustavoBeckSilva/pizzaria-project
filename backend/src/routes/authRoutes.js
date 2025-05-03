// src/routes/authRoutes.js
const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {
  criarUsuario,
  buscarUsuarioPorId,
  buscarUsuarioPorEmail,
} = require("../models/usuarioModel");

router.post("/register", async (req, res) => {
  const { nome, email, senha, tipo_usuario } = req.body;
  if (!nome || !email || !senha || !tipo_usuario) {
    return res.status(400).json({ error: "Dados incompletos" });
  }
  const hash = await bcrypt.hash(senha, 10);
  const user = await criarUsuario({
    nome,
    email,
    senha_hash: hash,
    tipo_usuario,
  });
  const token = jwt.sign(
    { id: user.id, tipo_usuario: user.tipo_usuario },
    process.env.JWT_SECRET
  );
  res.status(201).json({ user, token });
});

router.post("/login", async (req, res) => {
  const { email, senha } = req.body;
  if (!email || !senha)
    return res.status(400).json({ error: "Dados incompletos" });
  const usuario = await buscarUsuarioPorEmail(email);

  if (!usuario)
    return res.status(404).json({ error: "Usuário não encontrado" });
  const ok = await bcrypt.compare(senha, usuario.senha_hash);
  if (!ok) return res.status(401).json({ error: "Senha incorreta" });
  const token = jwt.sign(
    { id: usuario.id, tipo_usuario: usuario.tipo_usuario },
    process.env.JWT_SECRET
  );
  res.json({ user: usuario, token });
});

module.exports = router;
