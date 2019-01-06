import http from 'http';
http.createServer((req, res) => {
  res.end('hello');
}).listen(8000);