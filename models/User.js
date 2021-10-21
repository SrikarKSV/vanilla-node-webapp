const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 8,
  },
  role: {
    type: String,
    enum: ['mod', 'admin'],
  },
  postsMarked: {
    type: [String],
  },
  postsEdited: {
    type: [String],
  },
});

const userModel = mongoose.model('User', userSchema);

module.exports = userModel;
