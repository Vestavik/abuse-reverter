// server.js
const express = require('express');
const noblox = require('noblox.js');
const app = express();
const port = 3000;

app.use(express.static('public'));
app.use(express.json());

app.get('/groups', async (req, res) => {
  console.debug('[DEBUG] /groups endpoint called');
  const cookie = req.headers['x-cookie'];
  if (!cookie) return res.status(400).json({ error: 'Missing cookie header' });

  try {
    console.debug('[DEBUG] Setting cookie');
    await noblox.setCookie(cookie);
    console.debug('[DEBUG] Cookie set successfully');

    const user = await noblox.getAuthenticatedUser();
    console.debug('[DEBUG] Authenticated user:', user);

    const groups = await noblox.getGroups(user.id);
    console.debug('[DEBUG] All groups:', groups);

    const manageable = groups.filter(g => g?.Role && g.Role?.Rank >= 200).map(g => ({
      id: g.Id,
      name: g.Name,
      rank: g.Rank,
      role: g.Role,
      memberCount: g.MemberCount,
      emblemUrl: g.EmblemUrl
    }));
    console.debug('[DEBUG] Manageable groups:', manageable);
    res.json(manageable);
  } catch (err) {
    console.error('[ERROR]', err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/roles', async (req, res) => {
  const groupId = parseInt(req.query.groupId);
  if (!groupId) return res.status(400).json({ error: 'Missing groupId' });

  try {
    const roles = await noblox.getRoles(groupId);
    res.json(roles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/users', async (req, res) => {
  const groupId = parseInt(req.query.groupId);
  const rankId = parseInt(req.query.rankId);
  const cookie = req.headers['x-cookie'];
  if (!groupId || !rankId || !cookie) return res.status(400).json({ error: 'Missing params' });

  try {
    await noblox.setCookie(cookie);
    const users = await noblox.getPlayers(groupId, rankId);
    const result = users.map(u => ({ username: u.username, userId: u.userId }));
    res.json({ count: result.length, users: result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/revert', async (req, res) => {
  const { cookie, groupId, currentRankId, newRankId } = req.body;
  if (!cookie || !groupId || !currentRankId || !newRankId)
    return res.status(400).json({ error: 'Missing data' });

  try {
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
});

app.post('/manual', async (req, res) => {
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
});

app.listen(port, () => {
  console.log(`🔥 Server running at http://localhost:${port}`);
});
