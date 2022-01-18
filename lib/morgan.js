const { format } = require('date-fns');

function dev(req, res, startTime) {
  const colors = new Map([
    [500, '\x1b[31m'], // red
    [400, '\x1b[33m'], // yellow
    [300, '\x1b[36m'], // cyan
    [200, '\x1b[32m'], // green
  ]);

  const httpMethod = req.method;
  const path = req.url;
  const statusCode = Number(res.statusCode);
  const floorStatusCode = Math.floor(statusCode / 100) * 100;
  const diff = process.hrtime(startTime);
  const responseTime = `${(diff[0] * 1e3 + diff[1] * 1e-6).toFixed(3)}ms`;
  const logTime = format(new Date(), 'K:mm:ssaaa');

  console.log(
    `${logTime} - ${httpMethod} ${path} ${colors.get(
      floorStatusCode
    )}${statusCode}\x1b[0m ${responseTime}`
  );
}

module.exports = { dev };
