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
    if (req.session?.userId) {
      try {
        resolve(User.findById(req.session.userId));
      } catch (err) {
        res.emit('error', new ErrorResponse(err, 500));
      }
    } else {
      // User not logged in
      resolve(null);
    }
  });
}

module.exports = { requireAuth, checkUser };
