const pug = require('pug');
const path = require('path');
const ErrorResponse = require('./errorResponse');

function render(req, res) {
  return (fileName, locals) => {
    console.log(locals, req.flashes);
    pug.renderFile(
      path.join(path.dirname(__dirname), 'views', fileName + '.pug'),
      {
        cache: process.env.NODE_ENV === 'development' ? false : true,
        compileDebug: process.env.NODE_ENV === 'development' ? true : false,
        req,
        ...locals,
        flashes: { ...req?.flashes, ...locals?.flashes },
      },
      (err, compiledHtml) => {
        if (err) {
          if (process.env.NODE_ENV === 'production')
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
