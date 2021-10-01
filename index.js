const http = require('http');

// TODO: Make a logger
// TODO: Learn to use headers to redirect users
// TODO: Use javascript to give flashes
// TODO: Landing page which will have latest 5 confessions
// TODO: Confessions page with pagination
// TODO: Confession should be accompanied by title, date and beginning of confession
// TODO: Use pug and render error.stack if error or the html
// *: Try authentication for moderator to delete or edit the confession

const app = http.createServer((req, res) => {
  if (req.url === '/favicon.ico') return;
  console.log(req.headers);
  res.end('Hello world!!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`✅ Server running on : http://localhost:${PORT}`)
);
