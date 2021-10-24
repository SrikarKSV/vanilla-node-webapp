const path = require('path');
const parse = require('co-body');
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

exports.getEdit = async (req, res) => {
  const id = path.parse(req.url).name;
  const { title, confession } = await Confession.findById(id);
  res.render('edit-confession', {
    id,
    title,
    confession,
  });
};

exports.edit = async (req, res) => {
  const id = path.parse(req.url).name;
  const { title, confession } = await parse.form(req);

  const editedConfession = await Confession.findByIdAndUpdate(id, {
    title,
    confession,
    editedByStaff: res.locals.user._id,
  });

  await User.findByIdAndUpdate(res.locals.user._id, {
    $push: { postsEdited: editedConfession._id },
  });

  res
    .writeHead(303, {
      location: `/confessions/${editedConfession.slug}`,
    })
    .end();
};
