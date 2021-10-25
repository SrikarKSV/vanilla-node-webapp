const path = require('path');

function ifRequestIsFile(req) {
  const isStaticFile = !!path.parse(req.url)?.ext;
  return isStaticFile;
}

function matchURL(regexes, url) {
  return regexes.some((regex) => regex.test(url));
}

function combineFlashes(resFlashes = {}, localFlashes = {}) {
  const allTypes = new Set([
    ...Object.keys(resFlashes),
    ...Object.keys(localFlashes),
  ]);

  const flashes = {};
  allTypes.forEach((type) => {
    resFlashes[type] = resFlashes[type] ? resFlashes[type] : [];
    localFlashes[type] = localFlashes[type] ? localFlashes[type] : [];
    flashes[type] = [...resFlashes[type], ...localFlashes[type]];
  });

  return flashes;
}

module.exports = { ifRequestIsFile, matchURL, combineFlashes };
