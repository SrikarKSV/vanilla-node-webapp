const pug = require('pug');
const path = require('path');
const ErrorResponse = require('./errorResponse');

function render(req, res) {
  return (fileName, locals) => {
    pug.renderFile(
      path.join(path.dirname(__dirname), 'views', `${fileName}.pug`),
      {
        cache: process.env.NODE_ENV !== 'development',
        compileDebug: process.env.NODE_ENV === 'development',
        req,
        ...res.locals,
        ...locals,
        flashes: res.locals?.flashes,
      },
      (err, compiledHtml) => {
        if (err) {
          if (process.env.NODE_ENV === 'production')
            // eslint-disable-next-line no-param-reassign
            err.message = 'Internal Server Error';
          res.emit('error', new ErrorResponse(err, 500));
        } else {
          res.end(compiledHtml);
        }
      }
    );
  };
}

module.exports = render;
