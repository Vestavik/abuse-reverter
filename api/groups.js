// /api/groups.js
const noblox = require("noblox.js");

module.exports = async function handler(req, res) {
  const cookie = req.query.cookie;
  if (!cookie) return res.status(400).json({ error: "Missing cookie" });

  try {
    await noblox.setCookie(cookie);
    const currentUser = await noblox.getAuthenticatedUser();
    const userId = currentUser.userId;

    const groups = await noblox.getGroups(userId);
    if (!Array.isArray(groups)) {
      return res.status(500).json({ error: "Groups is not an array" });
    }

    // Filter groups where user has high enough rank (customize threshold if needed)
    const manageableGroups = groups.filter(g => g && g.role && g.role.rank >= 200);

    res.json(manageableGroups.map(group => ({
      id: group.id,
      name: group.name,
      rank: group.role.rank,
      role: group.role.name
    })));
  } catch (err) {
    console.error("Error loading groups:", err);
    res.status(500).json({ error: err.message });
  }
};
