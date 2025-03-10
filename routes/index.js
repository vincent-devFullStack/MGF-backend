var express = require("express");
var router = express.Router();

const Eleve = require("../models/eleves");
const Coach = require("../models/coachs");
const { checkBody } = require("../modules/checkBody");

const uniqid = require("uniqid");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");

const uid2 = require("uid2");
const bcrypt = require("bcrypt");

/* GET home page. */
router.get("/", function (req, res) {
  res.render("index", { title: "Express" });
});

//CheckEmail
router.post("/checkEmail", async (req, res) => {
  if (!checkBody(req.body, ["email"])) {
    res.json({ result: false, error: "Missing email" });
  }
  const existingEmail = await Eleve.findOne({
    email: req.body.email.toLowerCase(),
  });
  if (existingEmail) {
    res.json({ result: true, message: "Email already used" });
  } else {
    res.json({ result: false, message: "You can use this email" });
  }
});

//Register new "eleve"
router.post("/signupEleve", async (req, res) => {
  if (
    !checkBody(req.body, [
      "name",
      "firstname",
      "email",
      "password",
      "role",
      "objectif",
      "sexe",
      "taille",
      "dateNaissance",
      "poids",
    ])
  ) {
    res.json({ result: false, error: "Missing or empty fields" });
    return;
  }

  //Check if the user has not already been registered
  await Eleve.findOne({ email: req.body.email.toLowerCase() }).then((data) => {
    if (data === null) {
      const hash = bcrypt.hashSync(req.body.password, 10);

      const newEleve = new Eleve({
        name: req.body.name,
        firstname: req.body.firstname,
        email: req.body.email.toLowerCase(),
        password: hash,
        token: uid2(32),
        role: req.body.role,
        objectif: req.body.objectif,
        sexe: req.body.sexe,
        taille: req.body.taille,
        dateNaissance: req.body.dateNaissance,
        poids: req.body.poids,
      });

      newEleve.save().then((newDoc) => {
        res.json({ result: true, data: newDoc });
      });
    } else {
      //User already exists in database
      res.json({ result: false, error: "User already exists" });
    }
    return;
  });
});

//connect to élève
router.post("/signinEleve", (req, res) => {
  if (!checkBody(req.body, ["email", "password"])) {
    res.json({ result: false, error: "Missing or empty fields" });
    return;
  }
  Eleve.findOne({ email: req.body.email.toLowerCase() })
    .then((data) => {
      if (data && bcrypt.compareSync(req.body.password, data.password)) {
        res.json({ result: true, data: data });
      } else {
        res.json({ result: false, error: "User not found or wrong password" });
      }
    })
    .catch((err) => {
      console.error(err);
      return res
        .status(500)
        .json({ result: false, error: "Internal server error" });
    });
});

//Delete user élève
router.delete("/deleteEleve", (req, res) => {
  if (!checkBody(req.body, ["email"])) {
    res.json({ result: false, error: "Missing or empty fields" });
    return;
  }

  Eleve.deleteOne({ email: req.body.email.toLowerCase() }).then((data) => {
    if (data.deletedCount === 1) {
      res.json({ result: true, message: "User deleted" });
    } else {
      res.json({ result: false, error: "User not found" });
    }
  });
});

//register new coach
router.post("/signupCoach", (req, res) => {
  if (
    !checkBody(req.body, [
      "name",
      "firstname",
      "email",
      "password",
      "role",
      "photoProfil",
      "diplomes",
      "villes",
      "lieux",
      "siret",
      "domaineExpertise",
      "presentation",
    ])
  ) {
    res.json({ result: false, error: "Missing or empty fields" });
    return;
  }

  //Check if the user has not already been registered
  Coach.findOne({ email: req.body.email.toLowerCase() }).then((data) => {
    if (data === null) {
      const hash = bcrypt.hashSync(req.body.password, 10);

      const newCoach = new Coach({
        name: req.body.name,
        firstname: req.body.firstname,
        email: req.body.email.toLowerCase(),
        password: hash,
        token: uid2(32),
        photoProfil: req.body.photoProfil,
        role: req.body.role,
        siret: req.body.siret,
        diplomes: req.body.diplomes,
        villes: req.body.villes,
        lieux: req.body.lieux,
        domaineExpertise: req.body.domaineExpertise,
        abonnement: false,
        presentation: req.body.presentation,
      });

      newCoach.save().then((newDoc) => {
        res.json({ result: true, data: newDoc });
      });
    } else {
      //User already exists in database
      res.json({ result: false, error: "User already exists" });
    }
    return;
  });
});

//connect to coach
router.post("/signinCoach", (req, res) => {
  if (!checkBody(req.body, ["email", "password"])) {
    res.json({ result: false, error: "Missing or empty fields" });
    return;
  }
  Coach.findOne({ email: req.body.email.toLowerCase() }).then((data) => {
    if (data && bcrypt.compareSync(req.body.password, data.password)) {
      res.json({ result: true, data: data });
    } else {
      res.json({ result: false, error: "User not found or wrong password" });
    }
  });
});

//Delete user coach
router.delete("/deleteCoach", (req, res) => {
  if (!checkBody(req.body, ["email"])) {
    res.json({ result: false, error: "Missing or empty fields" });
    return;
  }

  Coach.deleteOne({ email: req.body.email.toLowerCase() }).then((data) => {
    if (data.deletedCount === 1) {
      res.json({ result: true, message: "User deleted" });
    } else {
      res.json({ result: false, error: "User not found" });
    }
  });
});

/* Upload photo */
router.post("/upload", async (req, res) => {
  console.log(req.files.photoFromFront);
  const photoPath = `./tmp/${uniqid()}.jpg`;
  const resultMove = await req.files.photoFromFront.mv(photoPath);

  if (!resultMove) {
    const resultCloudinary = await cloudinary.uploader.upload(photoPath);

    fs.unlinkSync(photoPath);

    res.json({
      result: true,
      url: cloudinary.url(resultCloudinary.secure_url, {
        width: 200,
        aspect_ratio: "1/1",
      }),
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

module.exports = router;
