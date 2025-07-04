require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

const { sequelize } = require('./models');

// Routes
const incidentRoutes = require('./routes/incident.routes');
const userRoutes = require('./routes/user.routes');
const zoneRoutes = require ('./routes/zone.routes');
const authRoutes = require('./routes/auth.routes')

app.use(cors());
app.use(express.json());

app.use(cors({
  origin: 'http://127.0.0.1:5500', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));


app.use('/api/incidents', incidentRoutes);
app.use('/api/users', userRoutes);
app.use('/api/zone', zoneRoutes);
app.use('/api/auth', authRoutes);


app.use((req, res) => {
  res.status(404).json({ message: "Route non trouvée" });
});

const PORT = process.env.PORT || 3000;
console.log("Modèles Sequelize chargés :", sequelize.models);

sequelize.sync({ alter: true })
  .then(() => {
    console.log('Base de données synchronisée avec relations');
    app.listen(PORT, () => {
      console.log(`Serveur démarré sur http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('Erreur de synchronisation :', err);
  });
