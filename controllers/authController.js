const parse = require('co-body');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User');

const maxAge = 3 * 24 * 60 * 60;
function createToken(id) {
  return jwt.sign({ id }, process.env.SECRET, { expiresIn: maxAge });
}

function createSendToken(req, res, user) {
  const token = createToken(user._id);

  req.flash('success', 'User successfully logged in 👍!');
  res.writeHead(303, {
    location: `/`,
    'Set-Cookie': `jwt=${token}; Max-Age=${maxAge * 1000}; HttpOnly`,
  });
  res.end();
}

exports.login = async (req, res) => {
  const { username, password } = await parse.form(req);

  if (!username || !password) {
    req.flash('error', 'Provide both username and password!');
    return res.writeHead(302, { location: `/login` }).end();
  }

  const user = await User.findOne({ username });
  if (!user) {
    req.flash('error', 'Username provided does not exist!');
    return res.writeHead(302, { location: `/login` }).end();
  }

  const auth = await bcrypt.compare(password, user.password);
  if (!auth) {
    req.flash('error', 'Password provided is incorrect!');
    return res.writeHead(302, { location: `/login` }).end();
  }

  createSendToken(req, res, user);
};

exports.signup = async (req, res) => {
  const { username, password, role } = await parse.form(req);

  const user = await User.create({ username, password, role });

  req.flash(
    'success',
    `Successfully created user: ${user.username} with the role: ${user.role}`
  );
  res
    .writeHead(303, {
      location: `/`,
    })
    .end();
};

exports.logout = (req, res) => {
  req.flash('success', 'Successfully logged user out 👋!');
  res
    .writeHead(302, {
      location: `/`,
      'Set-Cookie': `jwt=; Max-Age=1; HttpOnly`,
    })
    .end();
};

exports.getLogin = (req, res) => {
  if (res.locals.user) {
    req.flash('info', 'User already logged in');
    return res.writeHead(302, { location: '/' }).end();
  }
  res.render('login');
};

exports.getSignup = (req, res) => {
  res.render('signup');
};
