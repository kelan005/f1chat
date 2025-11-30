const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Tymczasowa pamięć wiadomości (RAM) – później przeniesiemy do MongoDB
let messages = [];

// Pobierz wszystkie wiadomości
router.get('/messages', (req, res) => {
  res.json(messages);
});

// Wyślij wiadomość
router.post('/send', async (req, res) => {
  const { userId, text } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'Użytkownik nie znaleziony' });

    const msg = { nick: user.nick || 'Anonim', text };
    messages.push(msg);

    res.json({ message: 'Wiadomość wysłana' });
  } catch (err) {
    console.error('❌ Błąd czatu:', err);
    res.status(500).json({ error: 'Błąd serwera' });
  }
});

module.exports = router; // 🔑 MUSI być router!
