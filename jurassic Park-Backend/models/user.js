const { DataTypes, Model } = require('sequelize');
const sequelize = require('../utils/dataBase');
const bcrypt = require('bcryptjs');

class User extends Model {
  async validatePassword(password) {
    return await bcrypt.compare(password, this.motDePasse);
  }
}

User.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  nom: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING(100),
    unique: true,
    allowNull: false,
    validate: { isEmail: true },
  },
  motDePasse: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM('Ranger', 'Technicien', 'Responsable', 'Directeur'),
    defaultValue: 'Ranger',
    allowNull: false,
  }
}, {
  sequelize,
  modelName: 'User',
  tableName: 'users',
  timestamps: true,
  hooks: {
    beforeCreate: async (user) => {
      user.motDePasse = await bcrypt.hash(user.motDePasse, 10);
    },
    beforeUpdate: async (user) => {
      if (user.changed('motDePasse')) {
        user.motDePasse = await bcrypt.hash(user.motDePasse, 10);
      }
    }
  }
});

module.exports = User;
