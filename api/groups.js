const noblox = require('noblox.js');

module.exports = async function handler(req, res) {
  console.log("[DEBUG] /api/groups endpoint called");

  const cookie = req.query.cookie;
  if (!cookie) {
    console.error("[ERROR] Missing cookie in request");
    return res.status(400).json({ error: 'Missing cookie' });
  }

  try {
    console.log("[DEBUG] Setting cookie");
    await noblox.setCookie(cookie);
    console.log("[DEBUG] Cookie set successfully");

    console.log("[DEBUG] Getting authenticated user");
    const user = await noblox.getAuthenticatedUser();
    console.log("[DEBUG] Authenticated user:", user);

    if (!user || !user.UserID) {
      console.error("[ERROR] No UserID from getAuthenticatedUser");
      return res.status(500).json({ error: 'Failed to get user info from cookie' });
    }

    console.log("[DEBUG] Getting groups for user ID:", user.UserID);
    const groups = await noblox.getGroups(user.UserID);
    console.log("[DEBUG] Raw groups:", groups);

    if (!Array.isArray(groups)) {
      console.error("[ERROR] getGroups did not return array:", groups);
      return res.status(500).json({ error: 'Unexpected response from getGroups' });
    }

    console.log("[DEBUG] Filtering manageable groups");
    const manageableGroups = groups.filter(g => {
      console.log("[DEBUG] Group:", g);
      return g.role && g.role.rank >= 255;
    });

    console.log("[DEBUG] Manageable groups:", manageableGroups);
    res.json(manageableGroups);
  } catch (err) {
    console.error("[FATAL ERROR]", err);
    res.status(500).json({ error: err.message });
  }
};
