const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 8,
  },
  slug: String,
  role: {
    type: String,
    enum: ['mod', 'admin'],
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

  this.slug = slugify(this.username, {
    lower: true,
    strict: true,
  });
  next();
});

// TODO: Catch unique error

const userModel = mongoose.model('User', userSchema);

module.exports = userModel;
