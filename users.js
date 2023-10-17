const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../db');

const router = express.Router();
const secretKey = 'supersecretkey';

function authenticateToken(req, res, next) {
  const token = req.header('Authorization');
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, secretKey, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

router.post('/register', async (req, res) => {
  const { email, gender, password, role } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  pool.query('INSERT INTO users (email, gender, password, role) VALUES ($1, $2, $3, $4)', [email, gender, hashedPassword, role], (error, results) => {
    if (error) {
      throw error;
    }
    res.sendStatus(201);
  });
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  
    if (user.rows.length > 0) {
      const validPassword = await bcrypt.compare(password, user.rows[0].password);
      if (validPassword) {
        const token = jwt.sign({ email: user.rows[0].email, role: user.rows[0].role }, secretKey, { expiresIn: '1h' });
        res.json({ token });
      } else {
        res.status(403).json({ error: 'Kata sandi salah' });
      }
    } else {
      res.status(403).json({ error: 'Pengguna tidak ditemukan' });
    }
});

router.get('/', (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * limit;

  pool.query('SELECT * FROM users OFFSET $1 LIMIT $2', [offset, limit], (error, results) => {
    if (error) {
      throw error;
    }
    res.json(results.rows);
  });

  /**
 * @swagger
 * /users:
 *   get:
 *     summary: Mendapatkan daftar pengguna dengan paginasi
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Halaman yang akan ditampilkan
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Jumlah pengguna per halaman
 *     responses:
 *       '200':
 *         description: Berhasil mendapatkan daftar pengguna
 *       '500':
 *         description: Kesalahan server
 */

});


router.get('/protected', authenticateToken, (req, res) => {
  res.json({ message: 'Hanya user terdaftar yang bisa mengakses ini!' });
});

module.exports = router;
