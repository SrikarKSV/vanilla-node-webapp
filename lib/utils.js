const path = require('path');

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

module.exports = {
  ifRequestIsFile,
  matchURL,
  json,
};
