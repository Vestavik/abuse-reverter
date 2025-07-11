const express = require('express');
const noblox = require('noblox.js');
const app = express();
const port = 3000;

app.use(express.static('public'));
app.use(express.json());

// Endpoint to get groups manageable by the cookie user
app.get('/groups', async (req, res) => {
  const cookie = req.headers['x-cookie'];
  if (!cookie) return res.status(400).json({ error: 'Missing cookie header' });

  try {
    await noblox.setCookie(cookie);
    const groups = await noblox.getGroups();
    // Only groups where user has rank >= 255 (can manage ranks)
    const manageable = groups.filter(g => g.role && g.role.rank >= 255);
    const result = manageable.map(g => ({ id: g.id, name: g.name }));
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Endpoint to get roles for a given group
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

// Endpoint to get users with a specific rank in a group (for manual rank change)
app.get('/users', async (req, res) => {
  const groupId = parseInt(req.query.groupId);
  const rankId = parseInt(req.query.rankId);
  if (!groupId || !rankId) return res.status(400).json({ error: 'Missing groupId or rankId' });

  try {
    const users = await noblox.getPlayers(groupId, rankId);
    const result = users.map(u => ({ username: u.username, userId: u.userId }));
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Revert abuse endpoint (mass rank change)
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

// Manual rank change for one user
app.post('/manual', async (req, res) => {
  const { cookie, groupId, userId, newRank } = req.body;
  if (!cookie || !groupId || !userId || !newRank) return res.status(400).json({ error: 'Missing data' });

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
