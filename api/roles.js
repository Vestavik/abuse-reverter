const noblox = require('noblox.js');

module.exports = async (req, res) => {
  try {
    const groupId = parseInt(req.query.groupId);
    if (!groupId) return res.status(400).json({ error: 'Missing groupId' });
    const roles = await noblox.getRoles(groupId);
    res.json(roles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
