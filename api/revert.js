import noblox from 'noblox.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { cookie, groupId, currentRankId, newRankId } = req.body;

  if (!cookie || !groupId || !currentRankId || !newRankId) {
    res.status(400).json({ error: 'Missing required data' });
    return;
  }

  try {
    await noblox.setCookie(cookie);

    const users = await noblox.getPlayers(groupId, currentRankId);
    let successCount = 0;
    const logs = [];

    for (const user of users) {
      try {
        await noblox.setRank(groupId, user.userId, newRankId);
        logs.push(`✅ Ranked user ${user.userId}`);
        successCount++;
      } catch (err) {
        logs.push(`❌ Failed user ${user.userId}: ${err.message}`);
      }
    }

    res.status(200).json({ success: true, count: successCount, logs });
  } catch (error) {
    res.status(500).json({ error: error.message || 'Failed to revert ranks' });
  }
}
