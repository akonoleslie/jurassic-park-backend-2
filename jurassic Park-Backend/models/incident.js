const { DataTypes, Model } = require('sequelize');
const sequelize = require('../utils/dataBase');

class Incident extends Model {}

Incident.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  titre: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  type: {
    type: DataTypes.ENUM('Evasion', 'Panne', 'Blessure'),
    allowNull: false,
  },
    zoneId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'zones',
      key: 'id',
    },
  },
  urgence: {
    type: DataTypes.ENUM('Basse', 'Moyenne', 'Haute'),
    allowNull: false,
  },
  statut: {
    type: DataTypes.ENUM('En cours', 'Résolu'),
    allowNull: false,
    defaultValue: 'En cours',
  },

}, {
  sequelize,
  modelName: 'Incident',
  tableName: 'incidents',
  timestamps: true,
});

module.exports = Incident;
