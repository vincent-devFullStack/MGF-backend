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

module.exports = router;
