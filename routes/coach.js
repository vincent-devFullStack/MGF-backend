var express = require("express");
const Coach = require("../models/coachs");
const Eleve = require("../models/eleves");
var router = express.Router();
const { checkBody } = require("../modules/checkBody");

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

// ajout d'un nouveau rendez-vous
router.post("/rdv", async (req, res) => {
  if (!checkBody(req.body, ["coachToken", "eleveToken", "date", "heure"])) {
    return res.json({ result: false, message: "Données manquantes" });
  }

  const coach = await Coach.findOne({ token: req.body.coachToken });
  if (!coach) {
    return res.json({ result: false, message: "Coach non trouvé" });
  }

  const eleve = await Eleve.findOne({ token: req.body.eleveToken });
  if (!eleve) {
    return res.json({ result: false, message: "Élève non trouvé" });
  }

  coach.rdv.push({
    date: req.body.date,
    heure: req.body.heure,
    eleve: eleve._id,
  });
  await coach.save();

  eleve.rdv.push({
    date: req.body.date,
    heure: req.body.heure,
    coach: coach._id,
  });
  await eleve.save();

  res.json({ result: true, message: "Rendez-vous ajouté avec succès" });
});

// Récupérer les rendez-vous du coach
router.get("/rdv/:token", async (req, res) => {
  const token = req.params.token;
  if (!token) {
    return res.json({ result: false, message: "Token requis" });
  }

  const coach = await Coach.findOne({ token: token }).populate({
    path: "rdv",
    populate: { path: "eleve" },
  });
  if (!coach) {
    return res.json({ result: false, message: "Coach non trouvé" });
  }
  res.json({ result: true, rdv: coach.rdv });
});

// Supprimer un rendez-vous
router.post("/rdv/delete", async (req, res) => {
  if (!checkBody(req.body, ["coachToken", "eleveToken", "date", "heure"])) {
    return res.json({ result: false, message: "Données manquantes" });
  }

  const coach = await Coach.findOne({ token: req.body.coachToken });
  if (!coach) {
    return res.json({ result: false, message: "Coach non trouvé" });
  }

  const eleve = await Eleve.findOne({ token: req.body.eleveToken });
  if (!eleve) {
    return res.json({ result: false, message: "Élève non trouvé" });
  }

  coach.rdv = coach.rdv.filter(
    (rdv) =>
      rdv.date !== req.body.date &&
      rdv.heure !== req.body.heure &&
      rdv.eleve !== eleve._id
  );
  await coach.save();

  eleve.rdv = eleve.rdv.filter(
    (rdv) =>
      rdv.date !== req.body.date &&
      rdv.heure !== req.body.heure &&
      rdv.coach !== coach._id
  );
  await eleve.save();

  res.json({ result: true, message: "Rendez-vous supprimé avec succès" });
});
module.exports = router;
