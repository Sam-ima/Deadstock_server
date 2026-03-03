const router = require("express").Router();
const { auth } = require("../config/firebase");

/* Assign Role */
router.post("/set-role", async (req, res) => {
  const { uid, role } = req.body;

  await auth.setCustomUserClaims(uid, { role });

  res.json({ success: true });
});

module.exports = router;
