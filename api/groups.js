const noblox = require('noblox.js');

module.exports = async function handler(req, res) {
  const cookie = req.query.cookie;
  if (!cookie) return res.status(400).json({ error: 'Missing cookie' });

  try {
    await noblox.setCookie(cookie); // bare sett cookie, IKKE ta return verdi her
    const userId = await noblox.getCurrentUserId(); // hent userId med denne funksjonen
    const groups = await noblox.getGroups(userId);

    const manageableGroups = groups.filter(g => g.rank >= 255);
    res.json(manageableGroups);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
