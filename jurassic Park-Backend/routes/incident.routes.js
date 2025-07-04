// routes/incident.routes.js

const express = require('express');
const router = express.Router();

const IncidentController = require('../controllers/incidentController');
const authMiddleware = require('../middleWare/auth.middleWare'); // optionnel

router.use(authMiddleware);

router.get('/', (req, res) => new IncidentController(req, res).getAll());

router.get('/:id', (req, res) => new IncidentController(req, res).getById());

router.post('/', (req, res) => new IncidentController(req, res).create());

router.put('/:id', (req, res) => new IncidentController(req, res).update());

router.delete('/:id', (req, res) => new IncidentController(req, res).delete());

module.exports = router;