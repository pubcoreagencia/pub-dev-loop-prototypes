
const http = require('node:http');
const port = Number(process.env.PORT || 3000);
http.createServer((_req, res) => {
  res.writeHead(200, { 'content-type': 'text/html' });
  res.end('<h1>Node App Ready</h1>');
}).listen(port, '127.0.0.1', () => console.log('SERVER_LISTENING'));
