const cookie = require('cookie');

function cookieParser(req) {
  if (req.cookies) {
    return req.cookies;
  }

  const rawCookies = req.headers.cookie;
  // no cookies
  if (!rawCookies) {
    return;
  }

  const cookies = cookie.parse(rawCookies);
  return cookies;
}

module.exports = cookieParser;
