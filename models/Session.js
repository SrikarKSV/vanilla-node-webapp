const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  sessionToken: {
    type: String,
    required: [true, 'Session token is required'],
    unique: true,
    index: true,
  },
  expires: Date,
  session: {
    type: String,
    default: '{}',
  },
});

const sessionModel = mongoose.model('Session', sessionSchema);

module.exports = sessionModel;
