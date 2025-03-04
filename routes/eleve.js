var express = require("express");
var router = express.Router();
const { checkBody } = require("../modules/CheckBody");

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

/* Ajout premières mesures */
router.post("/new-mesures", async (req, res) => {
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
    }
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
    }
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
      skeleton: {
        type: req.body.type,
        os: req.body.os,
        clavicule: req.body.clavicule,
        humerus: req.body.humerus,
        avantBras: req.body.avantBras,
        buste: req.body.buste,
        thorax: req.body.thorax,
        abdomen: req.body.abdomen,
        hanches: req.body.hanches,
        femur: req.body.femur,
        tibia: req.body.tibia,
      },
    }
  );

  if (!ossatures) {
    return res.json({ error: "Body mesures weren't updated!" });
  }

  res.json({ result: true, message: "Body mesures were updated!" });
});

module.exports = router;
