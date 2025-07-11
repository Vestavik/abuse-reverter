const noblox = require('noblox.js');

module.exports = async (req, res) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const groupId = parseInt(req.query.groupId);
  const rankId = parseInt(req.query.rankId);
  if (!groupId || !rankId) return res.status(400).json({ error: 'Missing groupId or rankId' });

  try {
    const users = await noblox.getPlayers(groupId, rankId);
    const result = users.map(u => ({ username: u.username, userId: u.userId, rank: rankId }));
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
