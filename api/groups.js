const noblox = require('noblox.js');

module.exports = async function handler(req, res) {
  const cookie = req.query.cookie;
  if (!cookie) return res.status(400).json({ error: 'Missing cookie' });

  try {
    console.log('Set cookie...');
    await noblox.setCookie(cookie);

    const userId = await noblox.getUserIdFromCookie();
    console.log('User ID:', userId);

    if (!userId) return res.status(400).json({ error: 'Invalid cookie' });

    const groups = await noblox.getGroups(userId);
    console.log('Groups:', groups);

    if (!Array.isArray(groups)) {
      console.error('Groups not array!');
      return res.status(500).json({ error: 'Groups not an array' });
    }

    const manageableGroups = groups.filter(g => g.rank >= 255);
    console.log('Manageable:', manageableGroups);

    res.json(manageableGroups);

  } catch (e) {
    console.error('Error:', e);
    res.status(500).json({ error: e.message || 'Unknown error' });
  }
};
