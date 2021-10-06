const http = require('http');
const path = require('path');
const serveStatic = require('serve-static');
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
  res.render = render(req, res);
  res.on('error', (err) => globalErrorHandler(err, req, res));
  if (ifRequestIsFile(req)) {
    const errorResponse = `${req.headers.host}${req.url} does not exist!`;
    serve(req, res, () =>
      res.emit('error', new ErrorResponse(errorResponse, 500))
    );
  }

  if (req.url === '/') res.render('index', { name: 'Srikar' });

  onFinished(res, () => morgan.dev(req, res, startTime));
}

module.exports = app;
