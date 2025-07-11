// api/groups.js
const noblox = require('noblox.js');

module.exports = async function handler(req, res) {
  const cookie = req.query.cookie;

  if (!cookie) return res.status(400).json({ error: 'Missing cookie' });

  try {
    await noblox.setCookie(cookie);
    const currentUser = await noblox.getCurrentUser(); // safer alternative
    const userId = currentUser.UserID;
    const groups = await noblox.getGroups(userId);
    const manageableGroups = groups.filter(g => g.role.rank >= 200); // adjust as needed

    res.status(200).json(manageableGroups);
  } catch (err) {
    console.error('❌ Error loading groups:', err);
    res.status(500).json({ error: err.message });
  }
};
