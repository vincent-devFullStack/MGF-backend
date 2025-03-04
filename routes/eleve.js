var express = require("express");
var router = express.Router();

const Coach = require("../models/coachs");
const Eleve = require("../models/eleves");

/* GET users listing. */

router.get("/:token", async (req, res) => {
  const { token } = req.params;

  if (!token) {
    return res.json({ error: "Token requis" });
  }

  const eleve = await Eleve.findOne({ token }).populate(
    "conversations",
    "programmes",
    "historique"
  );

  if (!eleve) {
    return res.json({ error: "Élève non trouvé" });
  }

  res.json({ result: true, conversations: eleve });
});

module.exports = router;
