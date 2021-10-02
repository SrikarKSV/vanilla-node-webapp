const path = require('path');

function ifRequestIsFile(req) {
  const parsedUrl = new URL(`https://${req.headers.host}${req.url}`);
  const pathname = parsedUrl.pathname;
  const isStaticFile = !!path.parse(pathname)?.ext;
  return isStaticFile;
}

module.exports = { ifRequestIsFile };
