const express = require('express');
const noblox = require('noblox.js');
const router = express.Router();

router.get('/groups', async (req, res) => {
  const cookie = req.query.cookie;
  if (!cookie) return res.json({ error: 'Missing cookie' });

  try {
    await noblox.setCookie(cookie);
    const userId = await noblox.getUserIdFromCookie();
    const groups = await noblox.getGroups(userId);
    const manageableGroups = groups.filter(g => g.rank >= 255);
    res.json(manageableGroups);
  } catch (err) {
    console.error('Error fetching groups:', err);
    res.json({ error: 'Failed to fetch groups, check your cookie or try again.' });
  }
});

module.exports = router;
