const pug = require('pug');
const path = require('path');

function render(fileName, locals) {
  let html;
  pug.renderFile(
    path.join(path.dirname(__dirname), 'views', fileName + '.pug'),
    {
      cache: process.env.NODE_ENV === 'development' ? false : true,
      compileDebug: process.env.NODE_ENV === 'development' ? true : false,
      ...locals,
    },
    (err, compiledHtml) => {
      if (err) {
        // This will suffice for error control for now
        console.warn('💥💥 Pug has an error', err.stack);
      }
      html = compiledHtml;
    }
  );
  this.end(html);
}

module.exports = render;
