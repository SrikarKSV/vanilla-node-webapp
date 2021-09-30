const http = require('http');

const app = http.createServer((req, res) => {
  res.end('Hello world!!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`✅ Server running on : http://localhost:${PORT}`)
);
