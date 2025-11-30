const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Rejestracja
router.post('/register', async (req, res) => {
  const { email, password } = req.body;
  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: 'Email już istnieje' });

    const user = new User({ email, password, friends: [], friendRequests: [] });
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


// 🔥 System znajomych

// Wysyłanie zaproszenia
router.post('/friends/request', async (req, res) => {
  const { fromUserId, toUserId } = req.body;
  try {
    const fromUser = await User.findById(fromUserId);
    const toUser = await User.findById(toUserId);

    if (!fromUser || !toUser) return res.status(404).json({ error: 'Użytkownik nie znaleziony' });

    if (toUser.friendRequests.includes(fromUser.nick) || toUser.friends.includes(fromUser.nick)) {
      return res.json({ error: 'Zaproszenie już wysłane lub jesteście znajomymi' });
    }

    toUser.friendRequests.push(fromUser.nick);
    await toUser.save();

    res.json({ message: 'Zaproszenie wysłane' });
  } catch (err) {
    console.error('❌ Błąd zaproszenia:', err);
    res.status(500).json({ error: 'Błąd serwera' });
  }
});

// Akceptacja zaproszenia
router.post('/friends/accept', async (req, res) => {
  const { fromNick, toUserId } = req.body;
  try {
    const toUser = await User.findById(toUserId);
    const fromUser = await User.findOne({ nick: fromNick });

    if (!toUser || !fromUser) return res.status(404).json({ error: 'Użytkownik nie znaleziony' });

    toUser.friendRequests = toUser.friendRequests.filter(n => n !== fromNick);
    toUser.friends.push(fromNick);
    fromUser.friends.push(toUser.nick);

    await toUser.save();
    await fromUser.save();

    res.json({ message: 'Zaproszenie zaakceptowane' });
  } catch (err) {
    console.error('❌ Błąd akceptacji:', err);
    res.status(500).json({ error: 'Błąd serwera' });
  }
});

// Odrzucenie zaproszenia
router.post('/friends/reject', async (req, res) => {
  const { fromNick, toUserId } = req.body;
  try {
    const toUser = await User.findById(toUserId);
    if (!toUser) return res.status(404).json({ error: 'Użytkownik nie znaleziony' });

    toUser.friendRequests = toUser.friendRequests.filter(n => n !== fromNick);
    await toUser.save();

    res.json({ message: 'Zaproszenie odrzucone' });
  } catch (err) {
    console.error('❌ Błąd odrzucenia:', err);
    res.status(500).json({ error: 'Błąd serwera' });
  }
});

// Lista znajomych i oczekujących
router.get('/friends/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ error: 'Użytkownik nie znaleziony' });

    res.json({
      friends: user.friends,
      pending: user.friendRequests
    });
  } catch (err) {
    console.error('❌ Błąd pobierania znajomych:', err);
    res.status(500).json({ error: 'Błąd serwera' });
  }
});

module.exports = router;
