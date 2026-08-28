
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const port = Number(process.env.PORT || 3000);
const server = http.createServer((req, res) => {
  const filePath = path.join(__dirname, 'public', 'index.html');
  if (fs.existsSync(filePath)) {
    res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' });
    res.end(fs.readFileSync(filePath, 'utf8'));
  } else {
    res.writeHead(200, { 'content-type': 'text/plain' });
    res.end('Template Ready');
  }
});
server.listen(port, '127.0.0.1', () => console.log('Listening on ' + port));
