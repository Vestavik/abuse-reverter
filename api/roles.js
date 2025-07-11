import noblox from 'noblox.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const groupId = parseInt(req.query.groupId);
  if (!groupId) {
    res.status(400).json({ error: 'Missing groupId parameter' });
    return;
  }

  try {
    const roles = await noblox.getRoles(groupId);
    res.status(200).json(roles);
  } catch (error) {
    res.status(500).json({ error: error.message || 'Failed to get roles' });
  }
}
