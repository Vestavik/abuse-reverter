const noblox = require('noblox.js');

module.exports = async function handler(req, res) {
  const cookie = req.query.cookie;
  if (!cookie) return res.status(400).json({ error: 'Missing cookie' });

  try {
    const userId = await noblox.setCookie(cookie); // This returns userId directly now
    const groups = await noblox.getGroups(userId);

    // Filter groups where user rank >= 255 (can manage roles)
    const manageableGroups = groups.filter(g => g.rank >= 255);

    res.json(manageableGroups);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
