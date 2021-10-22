const jwt = require('jsonwebtoken');
const User = require('../models/User');

function requireAuth(res, roles, callback) {
  const user = res.locals?.user;
  if (!user) return res.writeHead(302, { location: `/login` }).end(); // TODO: Flash that only staff can access
  if (!roles.includes(user.role))
    return res.writeHead(302, { location: `/` }).end(); // TODO: Flash your role can't perform this action

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
      console.log(decodedToken);
      let user = await User.findById(decodedToken.id);
      return resolve(user);
    });
  });
}

module.exports = { requireAuth, checkUser };
