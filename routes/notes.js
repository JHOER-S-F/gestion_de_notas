const { readNotes, writeNotes } = require('../utils/fileManager');
const { parseBody } = require('../utils/parseBody');

module.exports = async function (req, res) {
  const urlParts = req.url.split('/');
  const id = urlParts[3];

  if (req.method === 'GET' && !id) {
    const notes = await readNotes();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify(notes));
  }

  if (req.method === 'GET' && id) {
    const notes = await readNotes();
    const note = notes.find(n => n.id === id);
    if (note) {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify(note));
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ error: 'Nota no encontrada' }));
    }
  }

  if (req.method === 'POST') {
    const body = await parseBody(req);
    if (!body.title || !body.content) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ error: 'Title y content son requeridos' }));
    }

    const newNote = {
      id: Date.now().toString(),
      title: body.title,
      content: body.content,
      createdAt: new Date().toISOString(),
    };

    const notes = await readNotes();
    notes.push(newNote);
    await writeNotes(notes);

    res.writeHead(201, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Nota creada con éxito', note: newNote }));
  }

  if (req.method === 'PUT' && id) {
    const notes = await readNotes();
    const index = notes.findIndex(n => n.id === id);
    if (index === -1) {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ error: 'Nota no encontrada' }));
    }

    const body = await parseBody(req);
    notes[index] = { ...notes[index], ...body };
    await writeNotes(notes);

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Nota actualizada', note: notes[index] }));
  }

  if (req.method === 'DELETE' && id) {
    const notes = await readNotes();
    const filtered = notes.filter(n => n.id !== id);
    if (notes.length === filtered.length) {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ error: 'Nota no encontrada' }));
    }

    await writeNotes(filtered);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Nota eliminada con éxito' }));
  }

  if (!res.writableEnded) {
    res.writeHead(405, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Método no permitido o ruta inválida' }));
  }
};
