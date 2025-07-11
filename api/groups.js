// /api/groups.js
const noblox = require("noblox.js");

module.exports = async function handler(req, res) {
  const cookie = req.query.cookie;
  if (!cookie) return res.status(400).json({ error: "Missing cookie" });

  try {
    await noblox.setCookie(cookie);
    const user = await noblox.getAuthenticatedUser();
    const groups = await noblox.getGroups(user.UserId);

    const manageableGroups = groups.filter((g) => g.role && g.role.rank >= 255);
    res.json(manageableGroups);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
