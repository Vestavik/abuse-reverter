const noblox = require('noblox.js');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const { cookie, groupId, userId, newRank } = req.body;
  if (!cookie || !groupId || !userId || !newRank)
    return res.status(400).json({ error: 'Missing data' });

  try {
    await noblox.setCookie(cookie);
    await noblox.setRank(groupId, userId, newRank);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
