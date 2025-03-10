var express = require("express");
var router = express.Router();
const { checkBody } = require("../modules/checkBody");

const Programme = require("../models/programmes");
const Coach = require("../models/coachs");

/* Get programme by coach */
router.get("/:token", async (req, res) => {
  const token = req.params.token;

  if (!token) {
    return res.json({ error: "Token required" });
  }

  const coach = await Coach.findOne({ token }).populate("programmes");

  if (!coach) {
    return res.json({ error: "Coach not found" });
  }

  res.json({ result: true, programmes: coach.programmes });
});

/* Add new programme */
router.post("/new", async (req, res) => {
  if (
    !checkBody(req.body, [
      "name",
      "seances",
      "duree",
      "description",
      "photo",
      "exercices",
      "coachToken",
    ])
  ) {
    res.json({ result: false, error: "Missing or empty fields" });
    return;
  }

  const programme = await Programme.findOne({ name: req.body.name });

  if (programme) {
    return res.json({ result: false, error: "Programme already exists" });
  }

  const newProgramme = new Programme({
    name: req.body.name,
    seances: req.body.seances,
    duree: req.body.duree,
    description: req.body.description,
    photo: req.body.photo,
    exercices: req.body.exercices,
  });

  const addProgramme = await newProgramme.save();

  if (!addProgramme) {
    return res.json({ error: "Programme wasn't created" });
  }

  const coach = await Coach.findOne({ token: req.body.coachToken });
  coach.programmes.push(addProgramme._id);
  await coach.save();

  res.json({ result: true, data: addProgramme });
});

/* update programme */
router.post("/update", async (req, res) => {
  const updateProg = await Programme.updateOne(
    { name: req.body.name },
    { ...req.body }
  );

  if (!updateProg) {
    return res.json({ error: "Programme wasn't found" });
  }

  res.json({ result: true, message: "Programme was updated" });
});

/* delete programme */
router.post("/delete", async (req, res) => {
  if (!checkBody(req.body, ["name", "coachToken"])) {
    res.json({ result: false, error: "Missing or empty fields" });
    return;
  }

  const coach = await Coach.findOne({ token: req.body.coachToken });

  if (!coach) {
    return res.json({ result: false, error: "Coach not found" });
  }

  const programmeDelete = await Programme.deleteOne({
    name: { $regex: new RegExp(req.body.name, "i") },
  });

  if (programmeDelete.deletedCount === 0) {
    return res.json({ result: false, error: "Programme wasn't found" });
  }

  coach.programmes = coach.programmes.filter(
    (prog) => prog.name !== req.body.name
  );
  await coach.save();

  res.json({ result: true, message: "Programme was deleted" });
});

module.exports = router;
