const path = require('path');
const parse = require('co-body');
const Confession = require('../models/Confession');
const User = require('../models/User');
const ErrorResponse = require('../lib/errorResponse');

exports.dashboard = async (req, res) => {
  const postsMarked = await Confession.getPostsMarkedAsSpam();

  res.render('dashboard', {
    postsMarked,
  });
};

exports.profile = async (req, res) => {
  const username = path.parse(req.url).name;
  const user = await User.findOne({ username })
    .populate('postsMarked')
    .populate('postsEdited');

  if (!user) {
    return res.emit('error', new ErrorResponse('User not found 🤷‍♀️', 404));
  }
  res.render('profile', { user });
};

exports.getEdit = async (req, res) => {
  const id = path.parse(req.url).name;
  const confessionToBeEdited = await Confession.findById(id);
  if (!confessionToBeEdited) {
    const errorMessage = 'Confession to be edited is not found 🤷‍♀️';
    return res.emit('error', new ErrorResponse(errorMessage, 404));
  }

  const { title, confession } = confessionToBeEdited;
  res.render('edit-confession', {
    id,
    title,
    confession,
  });
};

exports.edit = async (req, res) => {
  const id = path.parse(req.url).name;
  const { title, confession } = await parse.form(req);

  if (!title || !confession) {
    req.flash('error', 'Provide both edited title and confession!');
    return res
      .writeHead(303, {
        location: req.headers.referer,
      })
      .end();
  }

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
