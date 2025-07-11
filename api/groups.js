const noblox = require('noblox.js');

module.exports = async function handler(req, res) {
  const cookie = req.query.cookie;
  if (!cookie) return res.status(400).json({ error: 'Missing cookie' });

  try {
    await noblox.setCookie(cookie);
    const userId = await noblox.getUserIdFromCookie();
    const groups = await noblox.getGroups(userId);

    console.log('Groups fetched:', groups);

    if (!Array.isArray(groups)) {
      return res.status(200).json({ error: 'Groups data is not an array. Possibly invalid cookie or no groups found.' });
    }

    const manageableGroups = groups.filter(g => g.rank >= 255);
    res.status(200).json(manageableGroups);
  } catch (err) {
    console.error('Error fetching groups:', err);
    res.status(200).json({ error: 'Failed to fetch groups, check your cookie or try again.' });
  }
};
