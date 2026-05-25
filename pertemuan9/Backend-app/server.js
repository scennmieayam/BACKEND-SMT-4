const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Koneksi ke MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'ecommerce'
});

// Test koneksi
db.connect((err) => {
  if (err) {
    console.error('Error koneksi ke database: ' + err.stack);
    return;
  }
  console.log('Terkoneksi ke database');
});

// Route untuk mengambil data
app.get('/api/data', (req, res) => {
  db.query('SELECT * FROM produk', (err, results) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(results);
    }
  });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
