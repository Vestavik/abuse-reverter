// api/groups.js
const noblox = require('noblox.js');

module.exports = async function handler(req, res) {
  const cookie = req.query.cookie;
  if (!cookie) return res.status(400).json({ error: 'Missing cookie' });

  try {
    await noblox.setCookie(cookie);
    const currentUser = await noblox.getAuthenticatedUser();
    const groups = await noblox.getGroups(currentUser.UserId);

    const manageableGroups = groups.filter(group => group.role && group.role.rank >= 255);
    res.json(manageableGroups);
  } catch (err) {
    console.error('❌ Error loading groups:', err);
    res.status(500).json({ error: err.message });
  }
}
