var express = require("express");
const Coach = require("../models/coachs");
const Eleve = require("../models/eleves");
var router = express.Router();

/* GET users listing. */
router.get("/:token", async (req, res) => {
  const token = req.params.token;

  if (!token) {
    return res.status(400).json({ error: "Token requis" });
  }
  const coach = await Coach.findOne({ token }).populate("eleves");
  if (!coach) {
    return res.json({ error: "Coach non trouvé" });
  }
  res.json({ result: true, eleves: coach.eleves });
});

router.post("/addEleve", (req, res) => {
  const { coachId, eleveId } = req.body;

  if (!coachId || !eleveId) {
    return res.json({ result: false, message: "Données manquantes" });
  }

  Coach.findById(coachId)
    .then((coach) => {
      if (!coach) {
        return res.status(404).json({
          result: false,
          message: "Coach non trouvé",
        });
      }

      if (!coach.eleves.includes(eleveId)) {
        coach.eleves.push(eleveId);
        return coach.save();
      }
      return coach;
    })
    .then(() => {
      return Eleve.findByIdAndUpdate(eleveId, { coach: coachId });
    })
    .then((eleve) => {
      if (!eleve) {
        return res.json({ result: false, message: "Élève non trouvé" });
      }
      res.json({ result: true, message: "Élève ajouté avec succès", eleve });
    });
});
module.exports = router;
