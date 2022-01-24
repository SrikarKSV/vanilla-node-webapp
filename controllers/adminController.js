const path = require('path');
const bodyParser = require('../lib/bodyParser');
const ErrorResponse = require('../lib/errorResponse');
const Confession = require('../models/Confession');
const User = require('../models/User');

exports.dashboard = async (req, res) => {
  let postsMarked = null;
  if (res.locals.user.role === 'admin')
    postsMarked = await Confession.getPostsMarkedAsSpam();

  res.render('dashboard', {
    postsMarked,
    title: 'Dashboard',
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
  res.render('profile', { title: user.username, user });
};

exports.getEdit = async (req, res) => {
  const id = path.parse(req.url).name;
  const confessionToBeEdited = await Confession.findById(id);
  if (!confessionToBeEdited) {
    const errorMessage = 'Confession to be edited is not found 🤷‍♀️';
    return res.emit('error', new ErrorResponse(errorMessage, 404));
  }

  const { title, confession, color } = confessionToBeEdited;
  res.render('edit-confession', {
    id,
    title,
    confession,
    color,
  });
};

exports.edit = async (req, res) => {
  const id = path.parse(req.url).name;
  const { title, confession } = await bodyParser.form(req, res);

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
    $addToSet: { postsEdited: editedConfession._id },
  });

  res
    .writeHead(303, {
      location: `/confessions/${editedConfession.slug}`,
    })
    .end();
};
