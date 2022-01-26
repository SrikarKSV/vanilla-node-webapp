const path = require('path');
const jwt = require('jsonwebtoken');

function ifRequestIsFile(req) {
  const isStaticFile = !!path.parse(req.url)?.ext;
  return isStaticFile;
}

function matchURL(regexes, url) {
  return regexes.some((regex) => regex.test(url));
}

function json(object) {
  return this.end(JSON.stringify(object));
}

function createToken(id) {
  return jwt.sign({ id }, process.env.SECRET, { expiresIn: '30d' });
}

module.exports = {
  ifRequestIsFile,
  matchURL,
  json,
  createToken,
};
