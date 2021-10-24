const path = require('path');
const Confession = require('../models/Confession');
const User = require('../models/User');

exports.admin = async (req, res) => {
  const postsMarked = await Confession.getPostsMarkedAsSpam();

  res.render('admin', {
    postsMarked,
  });
};

exports.profile = async (req, res) => {
  const username = path.parse(req.url).name;
  const user = await User.findOne({ username })
    .populate('postsMarked')
    .populate('postsEdited');
  res.render('profile', { user });
};
