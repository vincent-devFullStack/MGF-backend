var express = require("express");
var router = express.Router();
const { checkBody } = require("../modules/CheckBody");

const uniqid = require("uniqid");

const cloudinary = require("cloudinary").v2;
const fs = require("fs");

const Exercice = require("../models/exercices");

/* Get exercices */
router.get("/", async (req, res) => {
  const exercices = await Exercice.find();

  res.json({ exercices });
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
    ])
  ) {
    res.json({ result: false, error: "Missing or empty fields" });
    return;
  }

  const exercice = await Exercice.findOne({ name: req.body.name });

  if (exercice) {
    return res.json({ result: false, error: "Exercice already exists" });
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
    return res.json({ error: "Exercice wasn't created" });
  }

  res.json({ result: true, data: addExercice });
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

/* Upload video */
router.post("/upload-videos", async (req, res) => {
  const videoPath = `./tmp/${uniqid()}.mp4`;
  const resultMove = await req.files.videoFromFront.mv(videoPath);

  if (!resultMove) {
    const resultCloudinary = await cloudinary.uploader.upload(videoPath, {
      resource_type: "video",
    });

    fs.unlinkSync(videoPath);

    res.json({
      result: true,
      url: cloudinary.url(resultCloudinary.secure_url, {
        resource_type: "video",
      }),
    });
  } else {
    res.json({ result: false, error: resultMove });
  }
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
router.delete("/:name", async (req, res) => {
  const exerciceDelete = await Exercice.deleteOne({
    name: { $regex: new RegExp(req.params.name, "i") },
  });

  if (!exerciceDelete) {
    return res.json({ error: "Exercice wasn't found" });
  }

  res.json({ result: true, message: "Exercice was deleted" });
});

module.exports = router;
