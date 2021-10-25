const jwt = require('jsonwebtoken');
const User = require('../models/User');

function requireAuth(req, res, roles, callback) {
  const user = res.locals?.user;
  if (!user) {
    req.flash('warn', 'Only staff have access for the action to be performed');
    return res.writeHead(302, { location: `/login` }).end();
  }
  if (!roles.includes(user.role)) {
    req.flash('error', 'User with your role cannot perform that action');
    return res.writeHead(302, { location: `/` }).end();
  }

  callback();
}

function checkUser(req, res) {
  return new Promise((resolve, reject) => {
    const token = req.cookies?.jwt;

    if (!token) return resolve(null);

    jwt.verify(token, process.env.SECRET, async (err, decodedToken) => {
      if (err) {
        return resolve(null);
      }
      let user = await User.findById(decodedToken.id);
      return resolve(user);
    });
  });
}

module.exports = { requireAuth, checkUser };
