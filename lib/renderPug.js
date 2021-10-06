const pug = require('pug');
const path = require('path');
const ErrorResponse = require('./errorResponse');

function render(req, res) {
  return (fileName, locals) => {
    pug.renderFile(
      path.join(path.dirname(__dirname), 'views', fileName + '.pug'),
      {
        cache: process.env.NODE_ENV === 'development' ? false : true,
        compileDebug: process.env.NODE_ENV === 'development' ? true : false,
        req,
        ...locals,
      },
      (err, compiledHtml) => {
        if (err) {
          if (process.env.NODE_ENV === 'development')
            err.message = 'There was an error while compiling Pug.';
          else if (process.env.NODE_ENV === 'production')
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
