const pug = require('pug');
const path = require('path');

function render(fileName, locals) {
  const that = this; // To be used inside the method to emit errors

  pug.renderFile(
    path.join(path.dirname(__dirname), 'views', fileName + '.pug'),
    {
      cache: process.env.NODE_ENV === 'development' ? false : true,
      compileDebug: process.env.NODE_ENV === 'development' ? true : false,
      ...locals,
    },
    (err, compiledHtml) => {
      if (err) {
        that.emit('error', 500, err);
      } else {
        that.end(compiledHtml);
      }
    }
  );
}

module.exports = render;
