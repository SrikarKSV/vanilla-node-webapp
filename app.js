const http = require('http');
const path = require('path');
const serveStatic = require('serve-static');
const finalhandler = require('finalhandler');
const onFinished = require('on-finished');

const morgan = require('./lib/morgan');
const { ifRequestIsFile } = require('./lib/utils');
const render = require('./lib/renderPug');

const serve = serveStatic(path.join(__dirname, 'public'));

const app = http.createServer(server);

// TODO: Learn about on-headers and on-finished for logger
function server(req, res) {
  const startTime = process.hrtime(); // To calculate response time
  res.render = render;
  res.on('error', (statusCode, err) => {
    res.statusCode = statusCode;
    res.render('error', { err: err });
  });
  if (ifRequestIsFile(req)) {
    serve(req, res, () =>
      res.emit('error', 404, 'Cannot get the requested file!')
    );
  }

  if (req.url === '/') res.render('index', { name: 'Srikar' });

  onFinished(res, () => morgan.dev(req, res, startTime));
}

module.exports = app;
