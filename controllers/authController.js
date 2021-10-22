const parse = require('co-body');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
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

exports.login = async (req, res) => {
  const { username, password } = await parse.form(req);

  if (!username || !password) {
    // TODO: If possible use flash and redirect back
    return res.writeHead(302, { location: `/login` }).end();
  }

  const user = await User.findOne({ username });

  if (!user) {
    // TODO: FLash user doesn't exist
    console.log('User does not exist');
    return res.writeHead(302, { location: `/login` }).end();
  }
  const auth = await bcrypt.compare(password, user.password);
  if (!auth) {
    // TODO: FLash password incorrect
    console.log('Password incorrect');
    return res.writeHead(302, { location: `/login` }).end();
  }

  createSendToken(user, res);
};

exports.signup = async (req, res) => {
  const { username, password, role } = await parse.form(req);

  if (!username || !password || !role) {
    return res.writeHead(302, { location: `/login` }).end();
  }

  const user = await User.create({ username, password, role });
  createSendToken(user, res);
};

exports.logout = (req, res) => {
  res.writeHead(302, {
    location: `/`,
    'Set-Cookie': `jwt=; Max-Age=1; HttpOnly`,
  });
  res.end();
};

exports.getLogin = (req, res) => {
  res.render('login');
};

exports.getSignup = (req, res) => {
  res.render('signup');
};
