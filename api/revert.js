const noblox = require('noblox.js');

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).end();
  try {
    const { cookie, groupId, currentRankId, newRankId } = req.body;
    if (!cookie || !groupId || !currentRankId || !newRankId)
      return res.status(400).json({ error: 'Missing data' });

    await noblox.setCookie(cookie);
    const users = await noblox.getPlayers(groupId, currentRankId);
    let success = 0;
    const logs = [];

    for (const user of users) {
      try {
        await noblox.setRank(groupId, user.userId, newRankId);
        logs.push(`✅ Ranked user ${user.userId}`);
        success++;
      } catch (err) {
        logs.push(`❌ Failed user ${user.userId}: ${err.message}`);
      }
    }

    res.json({ success: true, count: success, logs });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
