const jwt = require('jsonwebtoken');
const ErrorResponse = require('../lib/errorResponse');
const User = require('../models/User');

function requireAuth(req, res, roles, callback) {
  const user = req?.user;
  if (!user) {
    const errorMsg = 'Only staff have access for the action to be performed';
    // Return json for a fetch requests
    if (req.headers.accept === 'application/json') {
      res.statusCode = 401;
      return res.json({ msg: errorMsg, status: 401 });
    }

    req.flash('warn', errorMsg);
    return res.writeHead(307, { location: `/login` }).end();
  }

  if (!roles.includes(user.role)) {
    const errorMsg = 'User with your role cannot perform that action';
    // Return json for a fetch requests
    if (req.headers.accept === 'application/json') {
      res.statusCode = 403;
      return res.json({ msg: errorMsg, status: 403 });
    }

    req.flash('error', errorMsg);
    return res.writeHead(307, { location: '/dashboard' }).end();
  }

  callback();
}

function checkUser(req, res) {
  return new Promise((resolve, reject) => {
    const token = req.cookies?.jwt;

    if (!token) resolve(null);

    jwt
      .verify(token, process.env.SECRET, async (err, decodedToken) => {
        if (err) {
          return resolve(null);
        }
        const user = await User.findById(decodedToken.id);
        return resolve(user);
      })
      .catch((err) => res.emit('error', new ErrorResponse(err)));
  });
}

module.exports = { requireAuth, checkUser };
