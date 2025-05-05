const http = require('http');

const port = process.env.PORT || 3000;

// Startup message
console.log('🚀 Server initializing...');

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Server is running\n');
});

server.listen(port, () => {
  console.log(`✅ Server operational on port ${port}`);
  console.log('📡 Waiting for incoming requests...');
});
