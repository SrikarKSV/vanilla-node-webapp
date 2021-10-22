const parse = require('co-body');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const maxAge = 3 * 24 * 60 * 60;
function createToken(id) {
  return jwt.sign({ id }, process.env.SECRET, { expiresIn: maxAge });
}

function createSendToken(user, res) {
  const token = createToken(user._id);

  res.writeHead(303, {
    location: `/`,
    'Set-Cookie': `jwt=${token}; Max-Age=${maxAge * 1000}; HttpOnly`,
  });
  res.end();
}

exports.login = (req, res) => {
  res.end('POST - Login');
};

exports.signup = async (req, res) => {
  const { username, password, role } = await parse.form(req);

  const user = await User.create({ username, password, role });
  createSendToken(user, res);
};

exports.logout = (req, res) => {
  res.end('GET - Logout');
};

exports.getLogin = (req, res) => {
  res.end('GET - Login');
};

exports.getSignup = (req, res) => {
  res.render('signup');
};
