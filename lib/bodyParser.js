const ErrorResponse = require('./errorResponse');

function form(req, res) {
  return new Promise((resolve, reject) => {
    let rawData = '';
    req.on('data', (chunk) => {
      rawData += chunk;
    });

    req.on('end', () => {
      try {
        const parsedData = new URLSearchParams(rawData);
        const parsedObject = {};
        for (const [key, value] of parsedData.entries()) {
          parsedObject[key] = value;
        }
        resolve(parsedObject);
      } catch (err) {
        res.emit('error', new ErrorResponse(err, 500));
      }
    });
  });
}

function json(req, res) {
  return new Promise((resolve, reject) => {
    let rawData = '';
    req.on('data', (chunk) => {
      rawData += chunk;
    });

    req.on('end', () => {
      try {
        resolve(JSON.parse(rawData));
      } catch (err) {
        res.emit('error', new ErrorResponse(err, 500));
      }
    });
  });
}

module.exports = { form, json };
