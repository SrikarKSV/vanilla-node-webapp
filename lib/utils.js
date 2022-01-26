const path = require('path');
const jwt = require('jsonwebtoken');
const Session = require('../models/Session');

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

function end(req, res) {
  // Changes how res.end works to save session before response is sent
  const resEnd = res.end;
  return async function (data, encoding) {
    res.end = resEnd;
    if (!req.session) return res.end(data, encoding);
    console.log(req.session);
    const currentSession = await Session.findById(req.sessionId);
    currentSession.session = JSON.stringify(req.session);
    currentSession.save();
    res.end(data, encoding);
  };
}

function createToken(id) {
  return jwt.sign({ id }, process.env.SECRET, { expiresIn: '31d' });
}

module.exports = {
  ifRequestIsFile,
  matchURL,
  json,
  createToken,
  end,
};
