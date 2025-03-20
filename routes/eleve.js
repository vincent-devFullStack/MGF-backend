var express = require("express");
var router = express.Router();
const { checkBody } = require("../modules/checkBody");

const uniqid = require("uniqid");

const Eleve = require("../models/eleves");

/* GET élèves data */
router.get("/:token", async (req, res) => {
  const { token } = req.params;

  if (!token) {
    return res.json({ error: "Token required" });
  }

  const eleve = await Eleve.findOne({ token: token })
    .populate("coach")
    .populate("conversations")
    .populate("programmes")
    .populate("historique.exercices.exercice");

  if (!eleve) {
    return res.json({ error: "Student not found!" });
  }

  res.json({ result: true, data: eleve });
});

/* POST envoie message tchat */
router.post("/chat", async (req, res) => {
  if (!checkBody(req.body, ["token", "texte", "firstname"])) {
    res.json({ result: false, error: "Missing or empty fields" });
    return;
  }

  const date = Date.now();

  const message = await Eleve.findOneAndUpdate(
    { token: req.body.token },
    {
      $push: {
        conversations: {
          date: date,
          name: req.body.firstname,
          texte: req.body.texte,
          role: req.body.role,
        },
      },
    }
  );

  if (!message) {
    return res.json({ error: "Le message n'a pas été envoyé!" });
  }

  res.json({ result: true, message: "Le message a été envoyé!" });
});

/* Delete message tchat */
router.delete("/delete-message", async (req, res) => {
  const { token, texte } = req.body;

  if (!token || !texte) {
    return res.json({ result: false, error: "Missing or empty fields" });
  }

  const eleve = await Eleve.findOne({ token });

  if (!eleve) {
    return res.json({ result: false, error: "Eleve non trouvé" });
  }

  eleve.conversations = eleve.conversations.filter(
    (msg) => msg.texte !== texte
  );

  await eleve.save();

  res.json({ result: true, message: "Message supprimé avec succès" });
});

/* Ajout premières mesures */
router.post("/first-mesures", async (req, res) => {
  if (
    !checkBody(req.body, [
      "token",
      "cou",
      "poitrine",
      "biceps",
      "taille",
      "hanche",
      "cuisse",
      "mollet",
      "poids",
    ])
  ) {
    res.json({ result: false, error: "Missing or empty fields" });
    return;
  }

  const mesures = await Eleve.findOneAndUpdate(
    { token: req.body.token },
    {
      bodyDepart: {
        poids: req.body.poids,
        cou: req.body.cou,
        poitrine: req.body.poitrine,
        biceps: req.body.biceps,
        taille: req.body.taille,
        hanche: req.body.hanche,
        cuisse: req.body.cuisse,
        mollet: req.body.mollet,
      },
    },
    { new: true }
  );

  if (!mesures) {
    return res.json({ error: "Les mesures n'ont pas été ajoutée" });
  }

  res.json({ result: true, message: "Mesures ajoutées avec succès!" });
});

/* Update mesures */
router.post("/mesures", async (req, res) => {
  if (
    !checkBody(req.body, [
      "token",
      "cou",
      "poitrine",
      "biceps",
      "taille",
      "hanche",
      "cuisse",
      "mollet",
      "poids",
    ])
  ) {
    res.json({ result: false, error: "Missing or empty fields" });
    return;
  }

  const mesures = await Eleve.findOneAndUpdate(
    { token: req.body.token },
    {
      bodyActuel: {
        poids: req.body.poids,
        cou: req.body.cou,
        poitrine: req.body.poitrine,
        biceps: req.body.biceps,
        taille: req.body.taille,
        hanche: req.body.hanche,
        cuisse: req.body.cuisse,
        mollet: req.body.mollet,
      },
    },
    { new: true }
  );

  if (!mesures) {
    return res.json({ error: "Les mesures n'ont pas été mises à jour" });
  }

  res.json({ result: true, message: "Mesures misent à jour avec succès!" });
});

/* Ajout ossature */
router.post("/ossature", async (req, res) => {
  if (
    !checkBody(req.body, [
      "token",
      "os",
      "type",
      "clavicule",
      "humerus",
      "avantBras",
      "buste",
      "thorax",
      "abdomen",
      "hanches",
      "femur",
      "tibia",
    ])
  ) {
    res.json({ result: false, error: "Missing or empty fields" });
    return;
  }

  const ossatures = await Eleve.findOneAndUpdate(
    { token: req.body.token },
    {
      "skeleton.type": req.body.type,
      "skeleton.os": req.body.os,
      "skeleton.clavicule": req.body.clavicule,
      "skeleton.humerus": req.body.humerus,
      "skeleton.avantBras": req.body.avantBras,
      "skeleton.buste": req.body.buste,
      "skeleton.thorax": req.body.thorax,
      "skeleton.abdomen": req.body.abdomen,
      "skeleton.hanches": req.body.hanches,
      "skeleton.femur": req.body.femur,
      "skeleton.tibia": req.body.tibia,
    },
    { new: true }
  );

  if (!ossatures) {
    return res.json({ error: "Mesures ossature n'ont pas été ajoutées" });
  }

  res.json({ result: true, message: "Mesures ossature ajoutées avec succès!" });
});

/* Ajout morphologie muscles */
router.post("/musculaire", async (req, res) => {
  if (
    !checkBody(req.body, [
      "token",
      "deltoidAnt",
      "deltoidLat",
      "deltoidPost",
      "biceps",
      "triceps",
      "abSup",
      "abPro",
      "trapezeSup",
      "trapezeMoy",
      "trapezeInf",
      "grandDorsal",
      "pectoraux",
      "abdominaux",
      "obliques",
      "cou",
      "quadriceps",
      "ischios",
      "fessiers",
      "abducteurs",
      "mollets",
      "tibias",
    ])
  ) {
    res.json({ result: false, error: "Missing or empty fields" });
    return;
  }

  const muscles = await Eleve.findOneAndUpdate(
    { token: req.body.token },
    {
      "muscles.deltoidAnt": req.body.deltoidAnt,
      "muscles.deltoidLat": req.body.deltoidLat,
      "muscles.deltoidPost": req.body.deltoidPost,
      "muscles.biceps": req.body.biceps,
      "muscles.triceps": req.body.triceps,
      "muscles.abSup": req.body.abSup,
      "muscles.abPro": req.body.abPro,
      "muscles.trapezeSup": req.body.trapezeSup,
      "muscles.trapezeMoy": req.body.trapezeMoy,
      "muscles.trapezeInf": req.body.trapezeInf,
      "muscles.grandDorsal": req.body.grandDorsal,
      "muscles.pectoraux": req.body.pectoraux,
      "muscles.abdominaux": req.body.abdominaux,
      "muscles.obliques": req.body.obliques,
      "muscles.cou": req.body.cou,
      "muscles.quadriceps": req.body.quadriceps,
      "muscles.ischios": req.body.ischios,
      "muscles.fessiers": req.body.fessiers,
      "muscles.abducteurs": req.body.abducteurs,
      "muscles.mollets": req.body.mollets,
      "muscles.tibias": req.body.tibias,
    },
    { new: true }
  );

  if (!muscles) {
    return res.json({ error: "Morphologie musculaire non ajoutée" });
  }

  res.json({
    result: true,
    message: "Morphologie musculaire ajoutée avec succès!",
  });
});

/* Ajout premières photos */
router.post("/first-photos", async (req, res) => {
  if (!checkBody(req.body, ["token", "front", "back", "profil"])) {
    res.json({ result: false, error: "Missing or empty fields" });
    return;
  }

  const photos = await Eleve.findOneAndUpdate(
    { token: req.body.token },
    {
      "photos.depart.front": req.body.front,
      "photos.depart.back": req.body.back,
      "photos.depart.profil": req.body.profil,
    },
    { new: true }
  );

  if (!photos) {
    return res.json({ error: "Photos non ajoutées" });
  }

  res.json({ result: true, message: "Photos ajoutées avec succès!" });
});

/* Ajout photos actuelles*/
router.post("/photos", async (req, res) => {
  if (!checkBody(req.body, ["token", "front", "back", "profil"])) {
    res.json({ result: false, error: "Missing or empty fields" });
    return;
  }

  const photos = await Eleve.findOneAndUpdate(
    { token: req.body.token },
    {
      "photos.actuelles.front": req.body.front,
      "photos.actuelles.back": req.body.back,
      "photos.actuelles.profil": req.body.profil,
    },
    { new: true }
  );

  if (!photos) {
    return res.json({ error: "Photos non ajoutées" });
  }

  res.json({ result: true, message: "Photos ajoutées avec succès!" });
});

/* Ajout programme*/
router.post("/programme", async (req, res) => {
  if (!checkBody(req.body, ["eleveToken", "id"])) {
    res.json({ result: false, error: "Missing or empty fields" });
    return;
  }
  const programmeEleve = await Eleve.updateOne(
    { token: req.body.eleveToken },
    { programmes: req.body.id }
  );

  if (!programmeEleve) {
    return res.json({ error: "Programme non ajouté" });
  }

  res.json({ result: true, message: "Programme ajouté avec succès!" });
});

/* Récupérer les rdv de l'élève */
router.get("/rdv/:token", async (req, res) => {
  const token = req.params.token;
  if (!token) {
    return res.json({ result: false, message: "Token requis" });
  }

  const eleve = await Eleve.findOne({ token: token })
    .populate({
      path: "rdv",
      populate: [{ path: "eleve" }, { path: "coach" }],
    })

    .populate({
      path: "historique",
      populate: {
        path: "exercices.exercice",
      },
    });
  if (!eleve) {
    return res.json({ result: false, message: "Eleve non trouvé" });
  }
  res.json({ result: true, rdv: eleve.rdv, programme: eleve.historique });
});

/* Delete programme*/
router.delete("/programme", async (req, res) => {
  if (!checkBody(req.body, ["eleveToken"])) {
    res.json({ result: false, error: "Missing or empty fields" });
    return;
  }
  const deleteProgramme = await Eleve.updateOne(
    { token: req.body.eleveToken },
    { programmes: null }
  );

  if (!deleteProgramme) {
    return res.json({ error: "Le programme n'a pas été supprimé" });
  }

  res.json({
    result: true,
    message: "Le programme a été supprimé avec succès!",
  });
});

/* Delete compte*/
router.delete("/deleteAccount", async (req, res) => {
  if (!checkBody(req.body, ["eleveToken"])) {
    res.json({ result: false, error: "Donnée manquante" });
    return;
  }
  const deleteAccount = await Eleve.deleteOne({ token: req.body.eleveToken });

  if (!deleteAccount) {
    return res.json({ error: "Le compte n'a pas été supprimé" });
  }

  res.json({ result: true, message: "Compte supprimé avec succès !" });
});

module.exports = router;
