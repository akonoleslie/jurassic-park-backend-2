const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mysql',
    logging: false
  }
);

// Chargement des modèles (en leur passant sequelize)
const defineUser = require('./user');
const defineIncident = require('./incident');
const defineZone = require('./zone');

const User = defineUser(sequelize);
const Incident = defineIncident(sequelize);
const Zone = defineZone(sequelize);

// Associations
Zone.hasMany(Incident);
Incident.belongsTo(Zone);

module.exports = {
  sequelize,
  User,
  Incident,
  Zone
};
