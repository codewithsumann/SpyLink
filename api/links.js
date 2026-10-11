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

function genSlug(len = 6) {
  const c = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  return Array.from({ length: len }, () => c[Math.floor(Math.random() * c.length)]).join('');
}

module.exports = async (req, res) => {
  const db = readDB();
  
  // Create link
  if (req.method === 'POST') {
    const { target, alias, campaign, expiry, tracking } = req.body;
    const slug = alias || genSlug();
    const link = {
      id: genSlug(8),
      slug,
      target,
      campaign: campaign || 'untitled',
      created: Date.now(),
      expiry: expiry > 0 ? Date.now() + expiry * 3600000 : 0,
      tracking: tracking || { geo: true, ip: true, screen: true, battery: true, canvas: false },
      clicks: []
    };
    db.links.push(link);
    writeDB(db);
    return res.json({ slug, url: `${req.headers.origin}/spy/${slug}` });
  }
  
  // Get links
  if (req.method === 'GET') {
    return res.json(db.links);
  }
  
  res.json({ error: 'Method not allowed' });
};