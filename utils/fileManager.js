const fs = require('fs').promises;
const path = require('path');
const filePath = path.join(__dirname, '../db/notes.json');

async function readNotes() {
  try {
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data || '[]');
  } catch (err) {
    return [];
  }
}

async function writeNotes(notes) {
  await fs.writeFile(filePath, JSON.stringify(notes, null, 2));
}

module.exports = { readNotes, writeNotes };
