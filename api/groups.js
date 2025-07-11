const noblox = require('noblox.js');

module.exports = async (req, res) => {
  try {
    // Read cookie from header or query (depends on your frontend)
    const cookie = req.headers.cookie || req.query.cookie;
    if (!cookie) {
      res.status(400).json({ error: 'Missing cookie' });
      return;
    }

    await noblox.setCookie(cookie);
    const groups = await noblox.getGroups();
    res.status(200).json(groups);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
