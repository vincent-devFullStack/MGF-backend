var express = require("express");
const Coach = require("../models/coachs");
const Eleve = require("../models/eleves");
var router = express.Router();

/* GET users listing. */
router.get("/:coachId", function (req, res) {
  const { coachId } = req.params;
  Coach.findById({ coachId })
    .populate("eleves")
    .then((data) => {
      res.json({ result: true, eleves: data.eleves });
    });
});

router.post("/addEleve", (req, res) => {
  const { coachId, eleveId } = req.body;

  if (!coachId || !eleveId) {
    return res.json({ result: false, message: "Données manquantes" });
  }

  Coach.findById(coachId)
    .then((coach) => {
      if (!coach) {
        return res
          .status(404)
          .json({ result: false, message: "Coach non trouvé" });
      }

      if (!coach.eleves.includes(eleveId)) {
        coach.eleves.push(eleveId);
        return coach.save();
      }
      return coach;
    })
    .then(() => {
      return Eleve.findByIdAndUpdate(
        eleveId,
        { coach: coachId },
        { new: true }
      );
    })
    .then((eleve) => {
      if (!eleve) {
        return res.json({ result: false, message: "Élève non trouvé" });
      }
      res.json({ result: true, message: "Élève ajouté avec succès", eleve });
    })
    .catch((error) =>
      res.status(500).json({ result: false, error: error.message })
    );
});
module.exports = router;
