// Full debugged /api/groups endpoint
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
    const user = await noblox.getAuthenticatedUser();
    console.log('[DEBUG] Authenticated user:', user);

    if (!user || !user.id) {
      console.log('[ERROR] No UserID from getAuthenticatedUser');
      return res.status(500).json({ error: 'Unable to get authenticated user ID' });
    }

    console.log('[DEBUG] Getting groups for userId:', user.id);
    const groups = await noblox.getGroups(user.id);
    console.log('[DEBUG] All groups:', JSON.stringify(groups, null, 2));

    const manageableGroups = [];
    for (const group of groups) {
      try {
        // Custom logic: if rank >= 250 assume it's manageable
        if (typeof group === 'object' && group.Rank >= 250) {
          manageableGroups.push({
            id: group.Id,
            name: group.Name,
            rank: group.Rank,
            role: group.Role,
            memberCount: group.MemberCount,
            emblemUrl: group.EmblemUrl,
          });
        } else {
          console.log('[WARN] Skipping group due to invalid structure:', group);
        }
      } catch (e) {
        console.log('[ERROR] Failed to check group:', e);
      }
    }

    console.log('[DEBUG] Manageable groups:', manageableGroups);

    if (manageableGroups.length === 0) {
      return res.status(200).json({ message: 'No manageable groups found in your account.' });
    }

    res.json(manageableGroups);
  } catch (err) {
    console.log('[ERROR] Something went wrong in /api/groups:', err);
    res.status(500).json({ error: err.message });
  }
};
