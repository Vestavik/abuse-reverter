const express = require('express');
const noblox = require('noblox.js');
const app = express();
const port = 3000;

app.use(express.static('public'));
app.use(express.json());

// Set cookie helper for requests needing cookie
async function setCookieSafe(cookie) {
  try {
    await noblox.setCookie(cookie);
  } catch (e) {
    throw new Error('Invalid cookie or failed to set cookie');
  }
}

// Get groups user can manage roles in (you might wanna add more permission checks)
app.get('/groups', async (req, res) => {
  const cookie = req.headers['x-cookie'];
  if (!cookie) return res.status(400).json({ error: 'Missing cookie header' });

  try {
    await setCookieSafe(cookie);
    const groups = await noblox.getGroups();

    // Optional: filter groups where user has some rank/permission
    // For now: just send all groups
    const manageableGroups = groups.map(g => ({ id: g.id, name: g.name }));

    res.json(manageableGroups);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get ranks for a group
app.get('/roles', async (req, res) => {
  const groupId = parseInt(req.query.groupId);
  if (!groupId) return res.status(400).json({ error: 'Missing or invalid groupId' });

  try {
    const roles = await noblox.getRoles(groupId);
    res.json(roles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Revert abuse ranks for users with currentRankId in group to newRankId
app.post('/revert', async (req, res) => {
  const { cookie, groupId, currentRankId, newRankId } = req.body;
  if (!cookie || !groupId || !currentRankId || !newRankId)
    return res.status(400).json({ error: 'Missing data' });

  try {
    await setCookieSafe(cookie);

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

// Get users in group with a specific rank (manual mode)
app.get('/users', async (req, res) => {
  const groupId = parseInt(req.query.groupId);
  const rankId = parseInt(req.query.rankId);
  if (!groupId || !rankId) return res.status(400).json({ error: 'Missing groupId or rankId' });

  try {
    const users = await noblox.getPlayers(groupId, rankId);
    // Map to only username, userId, rank info
    const result = users.map(u => ({
      username: u.username,
      userId: u.userId,
      rank: rankId,
    }));

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Manual change of rank for one user
app.post('/manual', async (req, res) => {
  const { cookie, groupId, userId, newRank } = req.body;
  if (!cookie || !groupId || !userId || !newRank)
    return res.status(400).json({ error: 'Missing data' });

  try {
    await setCookieSafe(cookie);
    await noblox.setRank(groupId, userId, newRank);

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


app.listen(port, () => {
  console.log(`🔥 Server running on http://localhost:${port}`);
});
