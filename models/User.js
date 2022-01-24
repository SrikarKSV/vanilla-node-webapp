const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required!'],
    unique: true,
    trim: true,
    validate: {
      validator(username) {
        return /^[A-Za-z0-9_-]+$/.test(username);
      },
      message:
        'Username can only have Letters, numbers, dashes, and underscores only. Please try again without symbols.',
    },
    maxlength: [20, 'Username too long! Maximum is 20 characters'],
    minlength: [5, 'Username too short! Minimum is 5 characters'],
  },
  password: {
    type: String,
    required: [true, 'Password is required!'],
    minlength: [8, 'Password too short! Minimum length is 8 characters'],
  },
  role: {
    type: String,
    enum: ['mod', 'admin'],
    required: [true, 'User role is required!'],
  },
  postsMarked: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Confession',
    },
  ],
  postsEdited: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Confession',
    },
  ],
});

userSchema.pre('save', async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);

  next();
});

const userModel = mongoose.model('User', userSchema);

module.exports = userModel;
