const http = require('http');

const port = process.env.PORT || 8080; 

console.log('🚀 Server initializing...');

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Server is running\n');
});


server.listen(port, '34.82.164.247', () => {
  console.log(`✅ Server operational on port ${port}`);
  console.log('📡 Waiting for incoming requests...');
});
