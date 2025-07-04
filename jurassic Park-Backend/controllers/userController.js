const { User } = require('../models');

class UserController {
  constructor(req, res) {
    this.req = req;
    this.res = res;
  }

  async getAll() {
    try {
      const users = await User.findAll({
        attributes: { exclude: ['motDePasse'] }, 
        order: [['createdAt', 'DESC']]
      });
      this.res.status(200).json(users);
    } catch (error) {
      this.res.status(500).json({ error: error.message });
    }
  }

  async getById() {
    try {
      const user = await User.findByPk(this.req.params.id, {
        attributes: { exclude: ['motDePasse'] }
      });

      if (!user) {
        return this.res.status(404).json({ message: 'Utilisateur non trouvé' });
      }

      this.res.status(200).json(user);
    } catch (error) {
      this.res.status(500).json({ error: error.message });
    }
  }

  async create() {
    try {
      const user = await User.create(this.req.body);
      const { motDePasse, ...userSansMotDePasse } = user.toJSON();
      this.res.status(201).json(userSansMotDePasse);
    } catch (error) {
      this.res.status(400).json({ error: error.message });
    }
  }

  async update() {
    try {
      const [updatedRowsCount, updatedRows] = await User.update(this.req.body, {
        where: { id: this.req.params.id },
        returning: true
      });

      if (updatedRowsCount === 0) {
        return this.res.status(404).json({ message: 'Utilisateur non trouvé' });
      }

      const { motDePasse, ...userSansMotDePasse } = updatedRows[0].toJSON();
      this.res.status(200).json(userSansMotDePasse);
    } catch (error) {
      this.res.status(400).json({ error: error.message });
    }
  }

  async delete() {
    try {
      const deletedRowsCount = await User.destroy({
        where: { id: this.req.params.id }
      });

      if (deletedRowsCount === 0) {
        return this.res.status(404).json({ message: 'Utilisateur non trouvé' });
      }

      this.res.status(204).end();
    } catch (error) {
      this.res.status(500).json({ error: error.message });
    }
  }
}

module.exports = UserController;
