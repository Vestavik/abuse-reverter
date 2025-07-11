const noblox = require('noblox.js');

module.exports = async function handler(req, res) {
  console.log('[DEBUG] /api/groups endpoint called');
  const cookie = req.query.cookie;

  if (!cookie) {
    console.log('[ERROR] Missing cookie');
    return res.status(400).json({ error: 'Missing cookie' });
  }

  try {
    console.log('[DEBUG] Setting cookie');
    await noblox.setCookie(cookie);
    console.log('[DEBUG] Cookie set successfully');

    console.log('[DEBUG] Getting authenticated user');
    const authUser = await noblox.getAuthenticatedUser();
    console.log('[DEBUG] Authenticated user:', authUser);

    const userId = authUser?.id;
    if (!userId) {
      console.log('[ERROR] No UserID from getAuthenticatedUser');
      return res.status(500).json({ error: 'Failed to get user ID' });
    }

    console.log(`[DEBUG] Getting groups for userId: ${userId}`);
    const groups = await noblox.getGroups(userId);

    console.log('[DEBUG] All groups:', JSON.stringify(groups, null, 2));
    const manageableGroups = groups.filter(g => {
      if (!g || !g.role || typeof g.role.rank !== 'number') {
        console.log('[WARN] Skipping group due to invalid structure:', g);
        return false;
      }
      return g.role.rank >= 200;
    });

    console.log('[DEBUG] Manageable groups:', manageableGroups);
    res.json(manageableGroups);
  } catch (err) {
    console.error('[ERROR]', err);
    res.status(500).json({ error: err.message });
  }
};
