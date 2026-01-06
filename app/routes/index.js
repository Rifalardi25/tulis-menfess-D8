const express = require("express");
const router = express.Router();
const db = require("../config/database");

// Halaman Utama - List Menfess
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM menfess ORDER BY created_at DESC"
    );
    res.render("index", { messages: rows });
  } catch (err) {
    console.error(err);
    res.render("index", { messages: [], error: "Database connection failed!" });
  }
});

// Halaman Create Menfess
router.get("/create", (req, res) => {
  res.render("create");
});

// Handle Form Submission
router.post("/send", async (req, res) => {
  const { sender, content, color } = req.body;
  if (!sender || !content) return res.redirect("/create");

  try {
    await db.query(
      "INSERT INTO menfess (sender, content, color) VALUES (?, ?, ?)",
      [sender, content, color]
    );
    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.redirect("/create");
  }
});


// TODO: Tambahkan Route LIKE di sini
// Clue: router.post('/like/:id', async (req, res) => { ... })
router.post('/like/:id', async (req, res) => {
    const { id } = req.params;
    try {
        // Query menambah nilai likes sebanyak +1 [cite: 197]
        await db.query('UPDATE menfess SET likes = likes + 1 WHERE id = ?', [id]);
        res.redirect('/'); // Redirect kembali ke halaman utama [cite: 200]
    } catch (err) {
        console.error(err);
        res.status(500).send("Gagal mengupdate Like");
    }
});

// TODO: Tambahkan Route DISLIKE di sini
// Clue: Mirip like, tapi yang ditambah kolom dislikes
router.post('/dislike/:id', async (req, res) => {
    const { id } = req.params;
    try {
        // Query menambah nilai dislikes sebanyak +1 [cite: 198]
        await db.query('UPDATE menfess SET dislikes = dislikes + 1 WHERE id = ?', [id]);
        res.redirect('/'); // Redirect kembali ke halaman utama [cite: 200]
    } catch (err) {
        console.error(err);
        res.status(500).send("Gagal mengupdate Dislike");
    }
});

module.exports = router;
