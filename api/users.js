const express = require('express');
const noblox = require('noblox.js');
const router = express.Router();

router.get('/users', async (req, res) => {
  const { cookie, groupId, rankId } = req.query;
  if (!cookie) return res.status(400).json({ error: 'Missing cookie' });
  if (!groupId) return res.status(400).json({ error: 'Missing groupId' });
  if (!rankId) return res.status(400).json({ error: 'Missing rankId' });

  try {
    await noblox.setCookie(cookie);
    // get users in group at rank
    const users = await noblox.getPlayers(groupId, parseInt(rankId));
    // users is array of objects with username, userId etc.
    res.json(users);
  } catch (err) {
    console.error('[ERROR] /api/users:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
