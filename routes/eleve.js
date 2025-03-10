var express = require("express");
var router = express.Router();
const checkBody = require("../modules/checkBody");

const uniqid = require("uniqid");

const Eleve = require("../models/eleves");

/* GET élèves data */
router.get("/:token", async (req, res) => {
  const { token } = req.params;

  if (!token) {
    return res.json({ error: "Token required" });
  }

  const eleve = await Eleve.findOne({ token: token }).populate("coach");

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
        },
      },
    }
  );

  if (!message) {
    return res.json({ error: "Message wasn't sent!" });
  }

  res.json({ result: true, message: "Message was sent!" });
});

/* Delete message tchat */
router.post("/delete-message", async (req, res) => {
  if (!checkBody(req.body, ["token", "texte"])) {
    res.json({ result: false, error: "Missing or empty fields" });
    return;
  }

  const eleve = await Eleve.findOne({ token: req.body.token });
  if (!eleve) {
    return res.json({ result: false, message: "Student not found" });
  }

  const newEleve = await eleve.conversations.filter(
    (e) => e.texte !== req.body.texte
  );

  const conversationsUpdate = await Eleve.findOneAndUpdate(
    { token: req.body.token },
    {
      conversations: newEleve,
    },
    { new: true }
  );

  if (!conversationsUpdate) {
    return res.json({ error: "Message wasn't deleted!" });
  }

  res.json({ result: true, message: "Message was deleted!" });
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
    ])
  ) {
    res.json({ result: false, error: "Missing or empty fields" });
    return;
  }

  const mesures = await Eleve.findOneAndUpdate(
    { token: req.body.token },
    {
      bodyDepart: {
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
    return res.json({ error: "Body mesures weren't added!" });
  }

  res.json({ result: true, message: "Body mesures were added!" });
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
    ])
  ) {
    res.json({ result: false, error: "Missing or empty fields" });
    return;
  }

  const mesures = await Eleve.findOneAndUpdate(
    { token: req.body.token },
    {
      bodyActuel: {
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
    return res.json({ error: "Body mesures weren't updated!" });
  }

  res.json({ result: true, message: "Body mesures were updated!" });
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
    return res.json({ error: "Skeletons weren't updated!" });
  }

  res.json({ result: true, message: "Skeletons were updated!" });
});

/* Ajout morphologie muscles */
router.post("/ossature", async (req, res) => {
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
    return res.json({ error: "Morphologies weren't updated!" });
  }

  res.json({ result: true, message: "Morphologies were updated!" });
});

/* Upload photo */
router.post("/upload", async (req, res) => {
  const photoPath = `./tmp/${uniqid()}.jpg`;
  const resultMove = await req.files.photoFromFront.mv(photoPath);

  if (!resultMove) {
    const resultCloudinary = await cloudinary.uploader.upload(photoPath);

    fs.unlinkSync(photoPath);

    res.json({
      result: true,
      url: cloudinary.url(resultCloudinary.secure_url),
    });
  } else {
    res.json({ result: false, error: resultMove });
  }
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
    return res.json({ error: "Pictures weren't added!" });
  }

  res.json({ result: true, message: "Pictures were added!" });
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
    return res.json({ error: "Pictures weren't added!" });
  }

  res.json({ result: true, message: "Pictures were added!" });
});

/* Ajout programme*/
router.post("/programme", async (req, res) => {
  if (!checkBody(req.body, ["email", "id"])) {
    res.json({ result: false, error: "Missing or empty fields" });
    return;
  }
  const programmeEleve = await Eleve.updateOne(
    { email: req.body.email },
    { programmes: req.body.id }
  );

  if (!programmeEleve) {
    return res.json({ error: "Programme wasn't added!" });
  }

  res.json({ result: true, message: "Programme was added!" });
});

/* Delete programme*/
router.delete("/programme", async (req, res) => {
  if (!checkBody(req.body, ["email"])) {
    res.json({ result: false, error: "Missing or empty fields" });
    return;
  }
  const deleteProgramme = await Eleve.updateOne(
    { email: req.body.email },
    { programmes: null }
  );

  if (!deleteProgramme) {
    return res.json({ error: "Programme wasn't deleted!" });
  }

  res.json({ result: true, message: "Programme was deleted!" });
});

module.exports = router;
