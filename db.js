const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',     
  host: 'localhost',
  database: 'movies-database',
  password: '6666', 
  port: 5433          
});

module.exports = pool;
