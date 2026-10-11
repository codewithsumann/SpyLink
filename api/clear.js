const fs = require('fs');
const path = require('path');

const DB_FILE = path.join(process.cwd(), 'data.json');

function writeDB(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

module.exports = async (req, res) => {
  if (req.method === 'DELETE') {
    writeDB({ links: [], clicks: [] });
    return res.json({ success: true });
  }
  
  res.json({ error: 'Method not allowed' });
};