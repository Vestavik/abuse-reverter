const noblox = require('noblox.js');

module.exports = async function handler(req, res) {
  const cookie = req.query.cookie;
  if (!cookie) {
    return res.status(400).json({ error: 'Missing cookie' });
  }

  try {
    console.log('Trying to set cookie...');
    await noblox.setCookie(cookie);

    console.log('Getting user ID...');
    const userId = await noblox.getUserIdFromCookie();
    console.log('User ID:', userId);

    if (!userId) {
      return res.status(400).json({ error: 'Invalid cookie, could not get user ID' });
    }

    console.log('Fetching groups...');
    const groups = await noblox.getGroups(userId);
    console.log('Groups:', groups);

    if (!Array.isArray(groups)) {
      console.error('Groups is not an array!');
      return res.status(500).json({ error: 'Groups is not an array, Roblox API may have changed or cookie is invalid' });
    }

    const manageableGroups = groups.filter(group => group.rank >= 255);
    console.log('Manageable groups:', manageableGroups);

    return res.json(manageableGroups);

  } catch (error) {
    console.error('Caught error:', error);
    return res.status(500).json({ error: error.message || 'Unknown error occurred' });
  }
};
