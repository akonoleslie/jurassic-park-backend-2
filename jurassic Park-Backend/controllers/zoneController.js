const { Zone } = require('../models');

class ZoneController {
  constructor(req, res) {
    this.req = req;
    this.res = res;
  }

  async getAll() {
    try {
      const zones = await Zone.findAll();
      this.res.status(200).json(zones);
    } catch (err) {
      this.res.status(500).json({ error: err.message });
    }
  }

  async getById() {
    try {
      const zone = await Zone.findByPk(this.req.params.id);
      if (!zone) {
        return this.res.status(404).json({ message: 'Zone non trouvée' });
      }
      this.res.status(200).json(zone);
    } catch (err) {
      this.res.status(500).json({ error: err.message });
    }
  }

  async create() {
    try {
      const zone = await Zone.create(this.req.body);
      this.res.status(201).json(zone);
    } catch (err) {
      this.res.status(400).json({ error: err.message });
    }
  }

  async update() {
    try {
      const zone = await Zone.findByPk(this.req.params.id);
      if (!zone) {
        return this.res.status(404).json({ message: 'Zone non trouvée' });
      }
      await zone.update(this.req.body);
      this.res.status(200).json(zone);
    } catch (err) {
      this.res.status(400).json({ error: err.message });
    }
  }

  async delete() {
    try {
      const zone = await Zone.findByPk(this.req.params.id);
      if (!zone) {
        return this.res.status(404).json({ message: 'Zone non trouvée' });
      }
      await zone.destroy();
      this.res.status(204).end();
    } catch (err) {
      this.res.status(500).json({ error: err.message });
    }
  }
}

module.exports = ZoneController;
