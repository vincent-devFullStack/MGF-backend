var express = require("express");
var router = express.Router();
const { checkBody } = require("../modules/checkBody");

const Exercice = require("../models/exercices");
const Coach = require("../models/coachs");

/* Get exercices by coach */
router.get("/:token", async (req, res) => {
  const token = req.params.token;

  if (!token) {
    return res.json({ error: "Token required" });
  }

  const coach = await Coach.findOne({ token }).populate("exercices");

  if (!coach) {
    return res.json({ error: "Coach not found" });
  }

  res.json({ result: true, exercices: coach.exercices });
});

/* Search exercices */
router.get("/search/:query", async (req, res) => {
  const response = await Exercice.find({
    name: { $regex: new RegExp(req.params.query, "i") },
  });

  const data = response.map((exo) => {
    return {
      id: exo.id,
      name: exo.name,
      description: exo.description,
      photo: exo.photo,
      video: exo.video,
      ciblage: exo.ciblage,
      utilisationMuscle: exo.utilisationMuscle,
      categorie: exo.categorie,
    };
  });

  res.json({ result: true, data: data });
});

/* Add new exercice */
router.post("/new", async (req, res) => {
  if (
    !checkBody(req.body, [
      "name",
      "description",
      "photo",
      "video",
      "ciblage",
      "utilisationMuscle",
      "categorie",
      "coachToken",
    ])
  ) {
    res.json({ result: false, error: "Missing or empty fields" });
    return;
  }

  const exercice = await Exercice.findOne({ name: req.body.name });

  if (exercice) {
    return res.json({ result: false, error: "Cet exercice existe déjà" });
  }

  const newExercice = new Exercice({
    name: req.body.name,
    description: req.body.description,
    photo: req.body.photo,
    video: req.body.video,
    ciblage: req.body.ciblage,
    utilisationMuscle: req.body.utilisationMuscle,
    categorie: req.body.categorie,
  });

  const addExercice = await newExercice.save();

  if (!addExercice) {
    return res.json({ error: "L'exercice n'a pas pu être créé" });
  }

  const coach = await Coach.findOne({ token: req.body.coachToken });
  coach.exercices.push(addExercice._id);
  await coach.save();

  res.json({ result: true, data: addExercice });
});

/* update exercice */
router.post("/update", async (req, res) => {
  const updateExo = await Exercice.updateOne(
    { name: req.body.name },
    { ...req.body }
  );

  if (!updateExo) {
    return res.json({ error: "Exercice wasn't found" });
  }

  res.json({ result: true, message: "Exercice was updated" });
});

/* delete exercice */
router.post("/delete", async (req, res) => {
  if (!checkBody(req.body, ["name", "coachToken"])) {
    res.json({ result: false, error: "Missing or empty fields" });
    return;
  }

  const coach = await Coach.findOne({ token: req.body.coachToken });
  if (!coach) {
    return res.json({ result: false, error: "Coach non trouvé" });
  }

  const exerciceDelete = await Exercice.deleteOne({
    name: { $regex: new RegExp(req.body.name, "i") },
  });

  if (exerciceDelete.deletedCount === 0) {
    return res.json({ error: "Exercice non trouvé" });
  }

  coach.exercices = coach.exercices.filter((exo) => exo.name !== req.body.name);
  await coach.save();

  res.json({ result: true, message: "Exercice supprimé avec succès!" });
});

module.exports = router;
