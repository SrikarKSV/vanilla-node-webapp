const jwt = require('jsonwebtoken');
const User = require('../models/User');

function requireAuth(req, res) {}

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

module.exports = { checkUser };
