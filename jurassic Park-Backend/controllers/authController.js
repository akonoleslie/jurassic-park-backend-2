const jwt = require('jsonwebtoken');
const { User } = require('../models');

class AuthController {
  constructor(req, res) {
    this.req = req;
    this.res = res;
  }
  async login() {
    const { email, motDePasse } = this.req.body;
    console.log(this.req.body)
    try {
      const user = await User.findOne({ where: { email } });
      console.log("block")

      console.log(this.req.body)

      if (!user || !(await user.validatePassword(motDePasse))) {
        return this.res.status(401).json({ message: 'Email ou mot de passe invalide' });
      }
      
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
      );

      this.res.status(200).json({
        token,
        user: {
          id: user.id,
          nom: user.nom,
          email: user.email,
          role: user.role
        }
      });
    } catch (error) {
      this.res.status(500).json({ error: error.message });
    }
  }

  async register() {
    try {
      const { nom, email, motDePasse, role } = this.req.body;
      const existing = await User.findOne({ where: { email } });
      if (existing) {
        return this.res.status(400).json({ message: 'Email déjà utilisé' });
      }

      const user = await User.create({ nom, email, motDePasse, role });

      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
      );

      this.res.status(201).json({
        token,
        user: {
          id: user.id,
          nom: user.nom,
          email: user.email,
          role: user.role
        }
      });
    } catch (error) {
      this.res.status(500).json({ error: error.message });
    }
  }
  
}

module.exports = AuthController;