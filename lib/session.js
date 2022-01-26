const jwt = require('jsonwebtoken');
const { randomBytes } = require('crypto');
const Session = require('../models/Session');
const ErrorResponse = require('./errorResponse');
const { createToken } = require('./utils');

async function sessionHandler(req, res) {
  if (req.session) return;
  try {
    // If session already exists then return it
    if (req.cookies?.sid) {
      const { id } = jwt.verify(req.cookies.sid, process.env.SECRET);
      const session = await Session.findOne({ sessionToken: id });
      // Check if session exists and has not expired has expired
      if (session && new Date() < session.expires) {
        req.sessionId = session._id;
        return JSON.parse(session.session);
      }
      // If session expired the delete it
      if (session) await Session.findByIdAndDelete(session._id);
    }

    // Generate new session token
    const sessionToken = randomBytes(20).toString('hex');
    const expires = new Date();
    expires.setDate(expires.getDate() + 30);
    const sessionBody = {
      sessionToken,
      expires,
    };
    const newSession = await Session.create(sessionBody);

    const sessionId = createToken(sessionToken);
    // Convert max age to seconds
    const maxAge = Math.floor((expires.getTime() - Date.now()) / 1000);
    res.setHeader(
      'Set-Cookie',
      `sid=${sessionId}; Max-Age=${maxAge.toString()}; path=/; HttpOnly`
    );

    req.sessionId = newSession._id;
    return JSON.parse(newSession.session);
  } catch (err) {
    res.emit('error', new ErrorResponse(err, 500));
  }
}

module.exports = sessionHandler;
