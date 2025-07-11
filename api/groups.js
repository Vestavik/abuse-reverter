const express = require('express');
const noblox = require('noblox.js');
const router = express.Router();

router.get('/groups', async (req, res) => {
  const cookie = req.query.cookie;
  if (!cookie) return res.status(400).json({ error: 'Missing cookie' });

  try {
    await noblox.setCookie(cookie);
    const userId = await noblox.getUserIdFromCookie();
    const groups = await noblox.getGroups(userId);
    // Filter groups where user can manage roles (rank >= some value)
    const manageableGroups = groups.filter(g => g.rank >= 255);
    res.json(manageableGroups);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
