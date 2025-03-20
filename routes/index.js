var express = require("express");
var router = express.Router();

const Eleve = require("../models/eleves");
const Coach = require("../models/coachs");
const { checkBody } = require("../modules/checkBody");

const uniqid = require("uniqid");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");

const uid2 = require("uid2");
const bcrypt = require("bcryptjs");

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
      "secretWord",
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
      const hashSecretWord = bcrypt.hashSync(req.body.secretWord, 10);

      const newEleve = new Eleve({
        name: req.body.name,
        firstname: req.body.firstname,
        email: req.body.email.toLowerCase(),
        password: hash,
        secretWord: hashSecretWord,
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

//register new coach
router.post("/signupCoach", (req, res) => {
  if (
    !checkBody(req.body, [
      "name",
      "firstname",
      "email",
      "password",
      "secretWord",
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
      const hashSecretWord = bcrypt.hashSync(req.body.secretWord, 10);

      const newCoach = new Coach({
        name: req.body.name,
        firstname: req.body.firstname,
        email: req.body.email.toLowerCase(),
        password: hash,
        secretWord: hashSecretWord,
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

/* Upload photo */
router.post("/upload", async (req, res) => {
  try {
    if (!req.files || !req.files.photoFromFront) {
      return res
        .status(400)
        .json({ result: false, error: "No photo file uploaded" });
    }
    const photoPath = `./tmp/${uniqid()}.jpg`;
    const resultMove = await req.files.photoFromFront.mv(photoPath);

    if (!resultMove) {
      const resultCloudinary = await cloudinary.uploader.upload(photoPath);

      fs.unlink(photoPath, (err) => {
        if (err) console.error("Error deleting temp file:", err);
      });

      res.json({
        result: true,
        url: resultCloudinary.secure_url,
      });
    }
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ result: false, error: error.message });
  }
});

/* Upload video */
router.post("/upload-videos", async (req, res) => {
  try {
    if (!req.files || !req.files.videoFromFront) {
      return res
        .status(400)
        .json({ result: false, error: "No video file uploaded" });
    }

    const videoPath = `./tmp/${uniqid()}.mp4`;

    const resultMove = await req.files.videoFromFront.mv(videoPath);

    if (!resultMove) {
      const resultCloudinary = await cloudinary.uploader.upload(videoPath, {
        resource_type: "video",
      });

      fs.unlink(videoPath, (err) => {
        if (err) console.error("Error deleting temp file:", err);
      });

      res.json({
        result: true,
        url: resultCloudinary.secure_url,
      });
    }
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ result: false, error: error.message });
  }
});

/* Reset Password */

router.post("/password-reset", async (req, res) => {
  const { email, secretWord } = req.body;

  if (!email || !secretWord) {
    return res.status(400).json({ error: "Email et secretWord requis." });
  }

  const lowerEmail = email.toLowerCase();

  let user = await Coach.findOne({ email: lowerEmail });
  let userType = "coach";

  if (!user) {
    user = await Eleve.findOne({ email: lowerEmail });
    userType = "eleve";
  }

  if (!user) {
    return res
      .status(404)
      .json({ error: "Aucun compte trouvé avec cet email." });
  }

  // Vérification du secretWord hashé
  if (!user.secretWord || !bcrypt.compareSync(secretWord, user.secretWord)) {
    return res.status(401).json({ error: "SecretWord incorrect." });
  }
});

module.exports = router;
