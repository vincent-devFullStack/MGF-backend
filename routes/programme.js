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
    !checkBody(req.body, ["name", "seances", "duree", "photo", "exercices"])
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
    photo: req.body.photo,
    exercices: req.body.exercices,
  });

  const addProgramme = await newProgramme.save();

  if (!addProgramme) {
    return res.json({ error: "Programme wasn't created" });
  }

  res.json({ result: true, data: addProgramme });
});

module.exports = router;
