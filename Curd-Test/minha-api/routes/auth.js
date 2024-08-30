const Usuario = require('../models/Usuario');
const jwt = require('jsonwebtoken');
const express = require('express');
const router = express.Router();

// Registrar um novo usuário
router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    let usuario = await Usuario.findOne({ username });

    if (usuario) {
      return res.status(400).send('Usuário já existe');
    }

    usuario = new Usuario({ username, password });
    await usuario.save();

    const payload = { id: usuario._id, username: usuario.username };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(201).send({ token });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Login do usuário
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const usuario = await Usuario.findOne({ username });

    if (!usuario) {
      return res.status(400).send('Usuário não encontrado');
    }

    const isMatch = await usuario.comparePassword(password);
    if (!isMatch) {
      return res.status(400).send('Senha inválida');
    }

    const payload = { id: usuario._id, username: usuario.username };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).send({ token });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// READ: Obter todos os usuários (apenas para fins de demonstração)
router.get('/users', async (req, res) => {
  try {
    const usuarios = await Usuario.find();
    res.status(200).send(usuarios);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// DELETE: Excluir um usuário por ID
router.delete('/:id', async (req, res) => {
  try {
    const usuario = await Usuario.findByIdAndDelete(req.params.id);
    if (!usuario) return res.status(404).send('Usuário não encontrado');
    res.status(200).send('Usuário excluído com sucesso');
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = router;
