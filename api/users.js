const noblox = require('noblox.js');

module.exports = async function handler(req, res) {
  try {
    const { cookie, groupId, rankId } = req.query;
    if (!cookie) return res.status(400).json({ error: 'Missing cookie' });
    if (!groupId) return res.status(400).json({ error: 'Missing groupId' });
    if (!rankId) return res.status(400).json({ error: 'Missing rankId' });

    await noblox.setCookie(cookie);
    const users = await noblox.getPlayers(parseInt(groupId), parseInt(rankId));

    const result = users.map(u => ({
      username: u.username,
      userId: u.userId,
      rank: rankId
    }));

    res.status(200).json(result);
  } catch (err) {
    console.error('[ERROR] /api/users:', err);
    res.status(500).json({ error: err.message });
  }
};
