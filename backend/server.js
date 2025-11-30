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
