const noblox = require('noblox.js');

module.exports = async function handler(req, res) {
  const groupId = parseInt(req.query.groupId);
  if (!groupId) return res.status(400).json({ error: 'Missing groupId' });

  try {
    const roles = await noblox.getRoles(groupId);
    res.status(200).json(roles);
  } catch (err) {
    console.error('Error fetching roles:', err);
    res.status(200).json({ error: 'Failed to fetch roles.' });
  }
};
