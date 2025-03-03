var express = require("express");
var router = express.Router();

require("../models/connection");
const Eleve = require("../models/eleves");
const Coach = require("../models/coachs");
const { checkBody } = require("../modules/CheckBody");

const uid2 = require("uid2");
const bcrypt = require("bcrypt");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

//Register user: "élève"
router.post("/signupEleve", (req, res) => {
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
      "morphologie",
    ])
  ) {
    res.json({ result: false, error: "Missing or empty fields" });
    return;
  }

  //Check if the user has not already been registered
  Eleve.findOne({ email: req.body.email }).then((data) => {
    if (data === null) {
      const hash = bcrypt.hashSync(req.body.password, 10);

      const newEleve = new Eleve({
        name: req.body.name,
        firstname: req.body.firstname,
        email: req.body.email,
        password: hash,
        token: uid2(32),
        role: req.body.role,
        objectif: req.body.objectif,
        sexe: req.body.sexe,
        taille: req.body.taille,
        dateNaissance: req.body.dateNaissance,
        poids: req.body.poids,
        morphologie: req.body.morphologie,
      });

      newEleve.save().then((newDoc) => {
        res.json({ result: true, token: newDoc.token });
      });
    } else {
      //User already exists in database
      res.json({ result: false, error: "User already exists" });
    }
  });
});

module.exports = router;
