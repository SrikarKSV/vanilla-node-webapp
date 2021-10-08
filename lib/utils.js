const path = require('path');

function ifRequestIsFile(req) {
  const isStaticFile = !!path.parse(req.url)?.ext;
  return isStaticFile;
}

module.exports = { ifRequestIsFile };
