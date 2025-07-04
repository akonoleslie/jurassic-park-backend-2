
const express = require('express');
const router = express.Router();
const ZoneController = require('../controllers/zoneController');

// Lister toutes les zones
router.get('/', (req, res) => new ZoneController(req, res).getAll());

// Détails d'une zone par ID
router.get('/:id', (req, res) => new ZoneController(req, res).getById());

// Créer une nouvelle zone
router.post('/', (req, res) => new ZoneController(req, res).create());

// Mettre à jour une zone
router.put('/:id', (req, res) => new ZoneController(req, res).update());

// Supprimer une zone
router.delete('/:id', (req, res) => new ZoneController(req, res).delete());

module.exports = router;
    