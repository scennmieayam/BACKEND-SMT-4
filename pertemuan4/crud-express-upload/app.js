const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const multer = require('multer');
const db = require('./db');
const fs = require('fs');

const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// app.use(express.static('public'));
app.use(express.static(path.join(__dirname, 'uploads')));
app.use(bodyParser.urlencoded({ extended: false }));

// READ: Tampilkan semua user
app.get('/', (req, res) => {
  db.query('SELECT * FROM users', (err, results) => {
    if (err) throw err;
    res.render('index', { users: results });
  });
});

// Set up storage engine untuk multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Nama file unik
  }
});

const upload = multer({ storage });

// CREATE: Form tambah
app.get('/add', (req, res) => {
  res.render('add');
});

app.post('/add', upload.single('file'), (req, res) => {
  const { name, email } = req.body;
  const { filename, path: filepath } = req.file;

  db.query(
    'INSERT INTO users SET ?',
    { name, email, filename, filepath },
    (err) => {
      if (err) throw err;
      res.redirect('/');
    }
  );
});

// UPDATE: Form edit
app.get('/edit/:id', (req, res) => {
  const id = req.params.id;

  db.query('SELECT * FROM users WHERE id = ?', [id], (err, results) => {
    if (err) throw err;
    res.render('edit', { user: results[0] });
  });
});

app.post('/edit/:id', upload.single('file'), (req, res) => {
  const { name, email } = req.body;
  const id = req.params.id;

  db.query(
    'UPDATE users SET name = ?, email = ? WHERE id = ?',
    [name, email, id],
    (err, results) => {
      if (err) throw err;

      db.query(
        'SELECT filepath FROM users WHERE id = ?',
        [id],
        (err, results) => {
          if (err) throw err;

          const oldFilePath = results[0].filepath;

          if (oldFilePath) {
            fs.unlink(oldFilePath, (err) => {
              if (err) throw err;

              res.redirect('/');

              // Update gambar baru
              db.query(
                'UPDATE users SET filename = ?, filepath = ? WHERE id = ?',
                [filename, filepath, id],
                (err) => {
                  if (err) throw err;
                  res.redirect('/');
                }
              );
            });
          }
        }
      );
    }
  );
});

app.get('/delete/:id', (req, res) => {
  const id = req.params.id;

  db.query(
    'SELECT filepath FROM users WHERE id = ?',
    [id],
    (err, results) => {
      if (err) throw err;

      const imagePath = results[0].filepath;

      if (imagePath) {
        // Hapus gambar dari server
        fs.unlink(imagePath, (err) => {
          if (err) throw err;

          // Hapus data dari database
          db.query('DELETE FROM users WHERE id = ?', [id], (err) => {
            if (err) throw err;
            res.redirect('/');
          });
        });
      }
    }
  );
});

app.listen(port, () => {
  console.log(`App running at http://localhost:${port}`);
});