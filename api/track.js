const fs = require('fs');
const path = require('path');

const DB_FILE = path.join(process.cwd(), 'data.json');

function readDB() {
  if (!fs.existsSync(DB_FILE)) return { links: [], clicks: [] };
  return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
}

function writeDB(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

module.exports = async (req, res) => {
  const db = readDB();
  
  if (req.method === 'POST') {
    const { slug, ip, geo, screen, battery, canvas, ua, device, apps } = req.body;
    const link = db.links.find(l => l.slug === slug);
    
    if (!link) return res.status(404).json({ error: 'Link not found' });
    
    const click = {
      time: Date.now(),
      slug,
      target: link.target,
      ua,
      ip: ip || req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket?.remoteAddress || 'unknown',
      geo,
      screen,
      battery,
      canvas,
      device,
      apps: apps || [],
      linkId: link.id
    };
    
    db.clicks.push(click);
    link.clicks.push(click);
    writeDB(db);
    
    return res.json({ success: true, click });
  }
  
  res.json({ error: 'Method not allowed' });
};