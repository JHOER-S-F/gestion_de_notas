const http = require('http');
const notesRouter = require('./routes/notes');

const server = http.createServer((req, res) => {
  if (req.url === '/health' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', uptime: process.uptime() }));
  } else if (req.url.startsWith('/api/notes')) {
    notesRouter(req, res);
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Ruta no encontrada' }));
  }
});

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || 'http://localhost:';

server.listen(PORT, () => {
  console.log(`Servidor corriendo en ${HOST}${PORT}`);
});

