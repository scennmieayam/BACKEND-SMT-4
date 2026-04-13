var express = require('express');
var router = express.Router();

// Array sementara untuk menggantikan MongoDB
let mahasiswaData = [];

// GET home page
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Data Mahasiswa', mahasiswa: mahasiswaData });
});

// Halaman Tambah
router.get('/add', (req, res) => {
  res.render('add');
});

// Proses Tambah
router.post('/add', (req, res) => {
  const { nama, nim, jurusan, alamat } = req.body;
  
  // Buat ID unik sederhana menggunakan timestamp
  const newData = {
    _id: Date.now().toString(),
    nama,
    nim,
    jurusan,
    alamat
  };
  
  mahasiswaData.push(newData);
  res.redirect('/');
});

// Halaman Edit
router.get('/edit/:id', (req, res) => {
  const mahasiswa = mahasiswaData.find(m => m._id === req.params.id);
  if (mahasiswa) {
    res.render('edit', { mahasiswa: mahasiswa });
  } else {
    res.redirect('/');
  }
});

// Proses Edit
router.post('/edit/:id', (req, res) => {
  const { nama, nim, jurusan, alamat } = req.body;
  
  // Cari index data berdasarkan id
  const index = mahasiswaData.findIndex(m => m._id === req.params.id);
  if (index !== -1) {
    mahasiswaData[index].nama = nama;
    mahasiswaData[index].nim = nim;
    mahasiswaData[index].jurusan = jurusan;
    mahasiswaData[index].alamat = alamat;
  }
  
  res.redirect('/');
});

// Proses Delete
router.get('/delete/:id', (req, res) => {
  mahasiswaData = mahasiswaData.filter(m => m._id !== req.params.id);
  res.redirect('/');
});

module.exports = router;
