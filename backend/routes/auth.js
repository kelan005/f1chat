const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Rejestracja
router.post('/register', async (req, res) => {
  const { email, password } = req.body;
  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: 'Email już istnieje' });

    const user = new User({ email, password });
    await user.save();

    res.json({ userId: user._id.toString() });
  } catch (err) {
    console.error('❌ Błąd rejestracji:', err);
    res.status(500).json({ error: 'Błąd serwera' });
  }
});

// Logowanie
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || user.password !== password) {
      return res.status(401).json({ error: 'Nieprawidłowy email lub hasło' });
    }

    res.json({ userId: user._id.toString() });
  } catch (err) {
    console.error('❌ Błąd logowania:', err);
    res.status(500).json({ error: 'Błąd serwera' });
  }
});

// Aktualizacja profilu
router.post('/profile', async (req, res) => {
  const { userId, nick, age, gender, about } = req.body;
  try {
    // sprawdź czy nick jest już zajęty przez kogoś innego
    const existingNick = await User.findOne({ nick });
    if (existingNick && existingNick._id.toString() !== userId) {
      return res.status(400).json({ error: 'Ten nick jest już zajęty' });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'Użytkownik nie znaleziony' });

    user.nick = nick;
    user.age = age;
    user.gender = gender;
    user.about = about;
    await user.save();

    res.json({ message: 'Profil zapisany', profile: user });
  } catch (err) {
    console.error('❌ Błąd profilu:', err);
    res.status(500).json({ error: 'Błąd serwera' });
  }
});


// Pobranie profilu
router.get('/profile/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ error: 'Użytkownik nie znaleziony' });

    res.json({ profile: user });
  } catch (err) {
    console.error('❌ Błąd pobierania profilu:', err);
    res.status(500).json({ error: 'Błąd serwera' });
  }
});

module.exports = router;
