const { Incident, User, Zone } = require('../models');

class IncidentController {
  constructor(req, res) {
    this.req = req;
    this.res = res;
  }

  async getAll() {
    try {
      const incidents = await Incident.findAll({
        include: [
          { model: Zone, attributes: ['id', 'nom'] }
        ],
        order: [['createdAt', 'DESC']]
      });
      this.res.status(200).json(incidents);
    } catch (error) {
      this.res.status(500).json({ error: error.message });
    }
  }

  async getById() {
    try {
      const incident = await Incident.findByPk(this.req.params.id, {
        include: [
          { model: Zone, attributes: ['id', 'nom'] }
        ]
      });

      if (!incident) {
        return this.res.status(404).json({ message: 'Incident non trouvé' });
      }

      this.res.status(200).json(incident);
    } catch (error) {
      this.res.status(500).json({ error: error.message });
    }
  }

  async create() {
    try {
      const newIncident = await Incident.create(this.req.body);
      this.res.status(201).json(newIncident);
    } catch (error) {
      this.res.status(400).json({ error: error.message });
    }
  }

  async update() {
    try {
      const [updatedRowsCount, updatedRows] = await Incident.update(
        this.req.body,
        {
          where: { id: this.req.params.id },
          returning: true
        }
      );

      if (updatedRowsCount === 0) {
        return this.res.status(404).json({ message: 'Incident non trouvé' });
      }

      this.res.status(200).json(updatedRows[0]);
    } catch (error) {
      this.res.status(400).json({ error: error.message });
    }
  }

  async delete() {
    try {
      const deletedRowsCount = await Incident.destroy({
        where: { id: this.req.params.id }
      });

      if (deletedRowsCount === 0) {
        return this.res.status(404).json({ message: 'Incident non trouvé' });
      }

      this.res.status(204).end();
    } catch (error) {
      this.res.status(500).json({ error: error.message });
    }
  }
}

module.exports = IncidentController;
