const noblox = require('noblox.js');

module.exports = async function handler(req, res) {
  const cookie = req.query.cookie;
  if (!cookie) return res.status(400).json({ error: 'Missing cookie' });

  try {
    console.log('Setting cookie...');
    await noblox.setCookie(cookie);

    console.log('Getting user ID from cookie...');
    const userId = await noblox.getUserIdFromCookie();
    console.log('User ID:', userId);

    console.log('Fetching groups...');
    const groups = await noblox.getGroups(userId);
    console.log('Groups raw:', groups);

    if (!Array.isArray(groups)) {
      console.error('Groups is NOT an array:', groups);
      return res.status(400).json({ error: 'Groups data is not an array. Maybe invalid cookie or no groups.' });
    }

    const manageableGroups = groups.filter(g => g.rank >= 255);
    console.log('Manageable groups:', manageableGroups);

    res.status(200).json(manageableGroups);
  } catch (err) {
    console.error('Error caught:', err);
    res.status(500).json({ error: err.message || 'Unknown server error' });
  }
};
