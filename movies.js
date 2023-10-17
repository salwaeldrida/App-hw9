const express = require('express');
const pool = require('../db');

const router = express.Router()

router.post('/', (req, res) => {
  const { title, genres, year } = req.body;
  pool.query('INSERT INTO movies (title, genres, year) VALUES ($1, $2, $3)', [title, genres, year], (error, results) => {
    if (error) {
      throw error;
    }
    res.sendStatus(201);
  });
});

router.delete('/:id', (req, res) => {
  const id = req.params.id;
  pool.query('DELETE FROM movies WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error;
    }
    res.sendStatus(200);
  });
});

router.put('/:id', (req, res) => {
  const id = req.params.id;
  const { title, genres, year } = req.body;
  pool.query('UPDATE movies SET title = $1, genres = $2, year = $3 WHERE id = $4', [title, genres, year, id], (error, results) => {
    if (error) {
      throw error;
    }
    res.sendStatus(200);
  });
});

router.get('/', (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * limit;

  pool.query('SELECT * FROM movies OFFSET $1 LIMIT $2', [offset, limit], (error, results) => {
    if (error) {
      throw error;
    }
    res.json(results.rows);
  });

  /**
 * @swagger
 * /movies:
 *   get:
 *     summary: Mendapatkan daftar film dengan paginasi
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
 *         description: Jumlah film per halaman
 *     responses:
 *       '200':
 *         description: Berhasil mendapatkan daftar film
 *       '500':
 *         description: Kesalahan server
 */

});


module.exports = router;
