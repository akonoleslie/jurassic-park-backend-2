// routes/user.routes.js

const express = require('express');
const router = express.Router();

const UserController = require('../controllers/userController');
const authMiddleware = require('../middleWare/auth.middleWare'); 

// Récupérer tous les utilisateurs
router.get('/', (req, res) => new UserController(req, res).getAll());

// Récupérer un utilisateur par ID
router.get('/:id', (req, res) => new UserController(req, res).getById());

// Créer un nouvel utilisateur (inscription)
router.post('/', (req, res) => new UserController(req, res).create());

// Mettre à jour les infos d’un utilisateur
router.put('/:id', (req, res) => new UserController(req, res).update());

// Supprimer un utilisateur
router.delete('/:id', (req, res) => new UserController(req, res).delete());

module.exports = router;
