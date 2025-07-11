const express = require('express');
const noblox = require('noblox.js');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(express.json());

// GET /groups - hent grupper du kan styre (bruk cookie i header)
app.get('/groups', async (req, res) => {
  const cookie = req.headers['x-cookie'];
  if (!cookie) return res.status(400).json({ error: 'Missing cookie header' });

  try {
    await noblox.setCookie(cookie);
    const groups = await noblox.getGroups();
    // Filtrer grupper hvor rank >= 255 (kan styre)
    const manageable = groups.filter(g => g.role && g.role.rank >= 255);
    const result = manageable.map(g => ({ id: g.id, name: g.name }));
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /roles - hent roller i en gruppe (bruk cookie i header)
app.get('/roles', async (req, res) => {
  const cookie = req.headers['x-cookie'];
  const groupId = parseInt(req.query.groupId);
  if (!cookie) return res.status(400).json({ error: 'Missing cookie header' });
  if (!groupId) return res.status(400).json({ error: 'Missing groupId' });

  try {
    await noblox.setCookie(cookie);
    const roles = await noblox.getRoles(groupId);
    res.json(roles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /users - hent brukere med spesifikk rank i gruppe (bruk cookie i header)
app.get('/users', async (req, res) => {
  const cookie = req.headers['x-cookie'];
  const groupId = parseInt(req.query.groupId);
  const rankId = parseInt(req.query.rankId);
  if (!cookie) return res.status(400).json({ error: 'Missing cookie header' });
  if (!groupId || !rankId) return res.status(400).json({ error: 'Missing groupId or rankId' });

  try {
    await noblox.setCookie(cookie);
    const users = await noblox.getPlayers(groupId, rankId);
    const result = users.map(u => ({ username: u.username, userId: u.userId }));
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /revert - revert abuse (masse rank-endring) med cookie i body
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

// POST /manual - manuelt rank-endring for én bruker med cookie i body
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
  console.log(`🔥 Server running on port ${port}`);
});
