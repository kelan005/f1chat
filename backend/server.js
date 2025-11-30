const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const chatRoutes = require('./routes/chat'); // import czatu

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Podpięcie routerów
app.use('/auth', authRoutes);
app.use('/chat', chatRoutes); // 🔑 tu podajemy router

// Połączenie z MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Połączono z MongoDB'))
  .catch(err => console.error('❌ Błąd MongoDB:', err));

// Start serwera
const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server działa na http://localhost:${PORT}`));


// Endpoint do aktualizacji avatara
app.put("/auth/update/:username", async (req, res) => {
  try {
    const { avatar } = req.body;
    const user = await mongoose.model("User").findOneAndUpdate(
      { username: req.params.username },
      { avatar },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ success: false, message: "Nie znaleziono użytkownika" });
    }
    res.json({ success: true, message: "Avatar zaktualizowany", user });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});
