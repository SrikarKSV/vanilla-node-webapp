const path = require('path');

function ifRequestIsFile(req) {
  const isStaticFile = !!path.parse(req.url)?.ext;
  return isStaticFile;
}

function matchURL(regexes, url) {
  return regexes.some((regex) => regex.test(url));
}

module.exports = { matchURL, ifRequestIsFile };
