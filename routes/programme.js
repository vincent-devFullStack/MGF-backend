var express = require("express");
var router = express.Router();
const { checkBody } = require("../modules/CheckBody");

const uniqid = require("uniqid");

const Programme = require("../models/programmes");

/* Get programmes */
router.get("/", async (req, res) => {
  const programmes = await Programme.find();

  res.json({ programmes });
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
router.delete("/:name", async (req, res) => {
  const programmeDelete = await Programme.deleteOne({
    name: { $regex: new RegExp(req.params.name, "i") },
  });

  if (!programmeDelete) {
    return res.json({ error: "Programme wasn't found" });
  }

  res.json({ result: true, message: "Programme was deleted" });
});

module.exports = router;
