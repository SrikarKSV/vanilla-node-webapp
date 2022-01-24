const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const bodyParser = require('../lib/bodyParser');
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

  createSendToken(req, res, user);
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

exports.logout = (req, res) => {
  req.flash('success', 'Successfully logged user out 👋!');
  res
    .writeHead(303, {
      location: '/',
      'Set-Cookie': 'jwt=; Max-Age=1; HttpOnly',
    })
    .end();
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
