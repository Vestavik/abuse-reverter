// api/roles.js
const noblox = require('noblox.js');

export default async function handler(req, res) {
  const { groupId } = req.query;
  if (!groupId) return res.status(400).json({ error: 'Missing groupId' });

  try {
    const roles = await noblox.getRoles(parseInt(groupId));
    res.status(200).json(roles);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
