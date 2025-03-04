var express = require("express");
const Coach = require("../models/coachs");
const Eleve = require("../models/eleves");
var router = express.Router();

/* GET users listing. */
router.get("/:token", async (req, res) => {
  const token = req.params.token;

  if (!token) {
    return res.json({ error: "Token requis" });
  }
  const coach = await Coach.findOne({ token }).populate("eleves");
  if (!coach) {
    return res.json({ error: "Coach non trouvé" });
  }
  res.json({ result: true, eleves: coach.eleves });
});

router.post("/addEleve", async (req, res) => {
  const { coachToken, eleveToken } = req.body;
  if (!coachToken || !eleveToken) {
    return res.json({ result: false, message: "Données manquantes" });
  }
  const coach = await Coach.findOne({ token: coachToken });
  if (!coach) {
    return res.json({ result: false, message: "Coach non trouvé" });
  }
  const eleve = await Eleve.findOne({ token: eleveToken });
  if (!eleve) {
    return res.json({ result: false, message: "Élève non trouvé" });
  }
  // Vérifier si l'élève est déjà ajouté
  if (!coach.eleves.includes(eleve._id)) {
    coach.eleves.push(eleve._id);
    await coach.save();
  }
  // Mettre à jour l'élève avec l'ID du coach
  eleve.coach = coach._id;
  await eleve.save();

  res.json({ result: true, message: "Élève ajouté avec succès", eleve });
});

router.delete("/eleve", async (req, res) => {
  const { coachToken, eleveToken } = req.body;
  if (!coachToken || !eleveToken) {
    return res.json({ result: false, message: "Données manquantes" });
  }

  const coach = await Coach.findOne({ token: coachToken });
  if (!coach) {
    return res.json({ result: false, message: "Coach non trouvé" });
  }
  const eleve = await Eleve.findOne({ token: eleveToken });
  if (!eleve) {
    return res.json({ result: false, message: "Élève non trouvé" });
  }
  coach.eleves = coach.eleves.filter(
    (id) => id.toString() !== eleve.id.toString()
  );
  await coach.save();

  eleve.coach = null;
  await eleve.save();

  res.json({ result: true, message: "elève supprimé avec succès" });
});
module.exports = router;
