const bcrypt = require('bcrypt');
const bodyParser = require('../lib/bodyParser');
const User = require('../models/User');

exports.login = async (req, res) => {
  const { username, password } = await bodyParser.form(req, res);

  if (!username || !password) {
    req.flash('error', 'Provide both username and password!');
    return res.writeHead(303, { location: '/login' }).end();
  }

  const user = await User.findOne({ username });
  if (!user) {
    req.flash('error', 'Username provided does not exist!');
    return res.writeHead(303, { location: '/login' }).end();
  }

  const auth = await bcrypt.compare(password, user.password);
  if (!auth) {
    req.flash('error', 'Password provided is incorrect!');
    return res.writeHead(303, { location: '/login' }).end();
  }

  req.flash('success', 'User successfully logged in 👍!');
  // Add userId to current session to login
  req.session = { ...req.session, userId: user._id };
  res.writeHead(303, { location: `/` }).end();
};

exports.signup = async (req, res) => {
  const { username, password, confirmPassword, role } = await bodyParser.form(
    req,
    res
  );

  if (password !== confirmPassword) {
    req.flash('error', 'The password confirmation does not match !');
    return res
      .writeHead(303, {
        location: '/signup',
      })
      .end();
  }

  const user = await User.create({ username, password, role });

  req.flash(
    'success',
    `Successfully created user: ${user.username} with the role: ${user.role}`
  );
  res
    .writeHead(303, {
      location: '/',
    })
    .end();
};

exports.logout = async (req, res) => {
  req.flash('success', 'Successfully logged user out 👋!');
  // Remove userId from session
  const currentSession = req.session;
  delete currentSession.userId;
  req.session = { ...currentSession };
  res.writeHead(303, { location: '/' }).end();
};

exports.getLogin = (req, res) => {
  if (req.user) {
    req.flash('info', 'User already logged in !');
    return res.writeHead(307, { location: '/' }).end();
  }
  res.render('login', { title: 'Login' });
};

exports.getSignup = (req, res) => {
  res.render('signup', { title: 'Sign Up' });
};
