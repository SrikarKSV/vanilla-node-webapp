const http = require('http');
const morgan = require('./lib/morgan');

// TODO: Make a logger
// TODO: Learn to use headers to redirect users
// TODO: Use javascript to give flashes
// TODO: Landing page which will have latest 5 confessions
// TODO: Confessions page with pagination
// TODO: Confession should be accompanied by title, date and beginning of confession
// TODO: Use pug and render error.stack if error or the html
// *: Try authentication for moderator to delete or edit the confession

const app = http.createServer(server);

function server(req, res) {
  const startTime = process.hrtime();

  if (req.url === '/favicon.ico') return res.end('Hello!');
  // console.log(req.headers);
  res.end('Hello world!!');
  morgan.dev(req, res, startTime);
}

module.exports = app;
