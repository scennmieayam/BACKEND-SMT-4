const router = require("express").Router();

// export controller yang ingin dipakai
const mahasiswaController = require("../controllers/mahasiswaController");

// endpoint mahasiswa
router.get("/", mahasiswaController.viewMahasiswa); // Untuk view
router.post("/", mahasiswaController.addMahasiswa); // Untuk menambahkan data mahasiswa
router.put("/", mahasiswaController.editMahasiswa); // Untuk merubah data mahasiswa
router.delete("/:id", mahasiswaController.deleteMahasiswa); // Untuk menghapus data mahasiswa

// Lalu export routernya
module.exports = router;
