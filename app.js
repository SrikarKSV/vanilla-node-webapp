const http = require('http');
const path = require('path');
const serveStatic = require('serve-static');
const finalhandler = require('finalhandler');
const onFinished = require('on-finished');

const morgan = require('./lib/morgan');
const { ifRequestIsFile } = require('./lib/utils');
const render = require('./lib/renderPug');
const ErrorResponse = require('./lib/errorResponse');
const { globalErrorHandler } = require('./helpers/errorHandlers');

const serve = serveStatic(path.join(__dirname, 'public'));

const app = http.createServer(server);

function server(req, res) {
  const startTime = process.hrtime(); // To calculate response time
  res.render = render;
  res.on('error', (err) => globalErrorHandler(err, req, res));
  if (ifRequestIsFile(req)) {
    serve(req, res, () =>
      res.emit(
        'error',
        new ErrorResponse(`${req.headers.host}${req.url} does not exist!`, 500)
      )
    );
  }

  if (req.url === '/') res.render('index', { name: 'Srikar' });

  onFinished(res, () => morgan.dev(req, res, startTime));
}

module.exports = app;
