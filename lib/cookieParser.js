const cookie = require('cookie');

function cookieParser(req) {
  if (req.cookies) {
    return req.cookies;
  }

  const rawCookies = req.headers.cookie;
  let cookies = Object.create(null);

  // no cookies
  if (!rawCookies) {
    return;
  }

  cookies = cookie.parse(rawCookies);
  // parse JSON cookies
  return JSONCookies(cookies);
}

function JSONCookie(str) {
  if (typeof str !== 'string' || str.substr(0, 2) !== 'j:') {
    return undefined;
  }

  try {
    return JSON.parse(str.slice(2));
  } catch (err) {
    return undefined;
  }
}

function JSONCookies(obj) {
  const cookies = Object.keys(obj);
  let val;

  cookies.forEach((key) => {
    val = JSONCookie(obj[key]);

    if (val) {
      obj[key] = val;
    }
  });

  return obj;
}

module.exports = cookieParser;
