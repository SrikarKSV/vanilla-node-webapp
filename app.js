const http = require('http');
const path = require('path');
const serveStatic = require('serve-static');
const finalhandler = require('finalhandler');
const morgan = require('./lib/morgan');
const { ifRequestIsFile } = require('./lib/utils');
const render = require('./lib/renderPug');

const serve = serveStatic(path.join(__dirname, 'public'));

// TODO: Complete error handling with eventemitter
const app = http.createServer(server);

function server(req, res) {
  const startTime = process.hrtime(); // To calculate response time
  if (ifRequestIsFile(req)) {
    serve(req, res, finalhandler(req, res));
    return;
  }
  res.render = render;

  res.render('index', { name: 'Srikar' });
  morgan.dev(req, res, startTime);
}

module.exports = app;
