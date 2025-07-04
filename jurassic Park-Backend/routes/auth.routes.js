const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authController');

router.post('/login', (req, res) => new AuthController(req, res).login());
router.post('/register', (req, res) => new AuthController(req, res).register());

module.exports = router; 
