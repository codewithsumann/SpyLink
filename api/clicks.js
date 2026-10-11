const fs = require('fs');
const path = require('path');

const DB_FILE = path.join(process.cwd(), 'data.json');

function readDB() {
  if (!fs.existsSync(DB_FILE)) return { links: [], clicks: [] };
  return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
}

module.exports = async (req, res) => {
  const db = readDB();
  
  if (req.method === 'GET') {
    return res.json(db.clicks.sort((a, b) => b.time - a.time));
  }
  
  res.json({ error: 'Method not allowed' });
};