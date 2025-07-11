const noblox = require('noblox.js');

module.exports = async function handler(req, res) {
  const cookie = req.query.cookie;
  if (!cookie) return res.status(400).json({ error: 'Missing cookie' });

  try {
    const userId = await noblox.setCookie(cookie); // THIS returns userId
    const groups = await noblox.getGroups(userId);

    const manageableGroups = groups.filter(g => g.rank >= 255);
    res.json(manageableGroups);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
