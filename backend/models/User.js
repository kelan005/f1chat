const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  nick: { type: String, unique: true }, // 🔑 nick musi być unikalny
  age: { type: Number },
  gender: { type: String },
  about: { type: String }
});

module.exports = mongoose.model('User', userSchema);
