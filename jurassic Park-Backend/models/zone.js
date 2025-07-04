// models/zone.js
const { DataTypes, Model } = require('sequelize');
const sequelize = require('../utils/dataBase');

class Zone extends Model {}

Zone.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  nom: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  }
}, {
  sequelize,
  modelName: 'Zone', 
  tableName: 'zones',
  timestamps: true,
});

module.exports = Zone;
