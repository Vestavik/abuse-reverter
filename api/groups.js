const noblox = require('noblox.js');

module.exports = async function handler(req, res) {
  const cookie = req.query.cookie;
  if (!cookie) return res.status(400).json({ error: 'Missing cookie' });

  try {
    await noblox.setCookie(cookie);
    const userId = await noblox.getUserIdFromCookie();
    const groups = await noblox.getGroups(userId);

    if (!Array.isArray(groups)) {
      // groups is not an array — probably an error object or something else
      return res.status(400).json({ error: 'Groups data is not an array, maybe invalid cookie or no groups' });
    }

    const manageableGroups = groups.filter(g => g.rank >= 255);
    res.status(200).json(manageableGroups);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
