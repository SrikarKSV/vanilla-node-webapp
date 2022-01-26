const bcrypt = require('bcrypt');
const bodyParser = require('../lib/bodyParser');
const csrf = require('../lib/csrf');
const User = require('../models/User');

exports.login = async (req, res) => {
  const { username, password, csrfToken } = await bodyParser.form(req, res);

  if (!csrfToken || !csrf.checkValidCsrfToken(csrfToken, req)) {
    req.flash('error', 'Csrf token not valid ! Try again :)');
    return res.writeHead(303, { location: '/login' }).end();
  }

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
  req.session.userId = user._id;
  res.writeHead(303, { location: `/` }).end();
};

exports.signup = async (req, res) => {
  const { username, password, confirmPassword, role, csrfToken } =
    await bodyParser.form(req, res);

  if (!csrfToken || !csrf.checkValidCsrfToken(csrfToken, req)) {
    req.flash('error', 'Csrf token not valid ! Try again :)');
    return res.writeHead(303, { location: '/signup' }).end();
  }

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
  delete req.session.userId;
  res.writeHead(303, { location: '/' }).end();
};

exports.getLogin = (req, res) => {
  if (req.user) {
    req.flash('info', 'User already logged in !');
    return res.writeHead(307, { location: '/' }).end();
  }
  const csrfToken = csrf.generateCsrf(req);
  res.render('login', { title: 'Login', csrfToken });
};

exports.getSignup = (req, res) => {
  const csrfToken = csrf.generateCsrf(req);
  res.render('signup', { title: 'Sign Up', csrfToken });
};
