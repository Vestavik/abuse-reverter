const noblox = require('noblox.js');

module.exports = async (req, res) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const cookie = req.query.cookie;
  if (!cookie) return res.status(400).json({ error: 'Missing cookie' });

  try {
    await noblox.setCookie(cookie);
    const groups = await noblox.getGroups();
    // Filter groups where user can manage roles (rank >= 255)
    const manageableGroups = groups.filter(g => g.rank >= 255);
    res.json(manageableGroups);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
