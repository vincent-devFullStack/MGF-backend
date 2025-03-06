const mongoose = require("mongoose");

const coachSchema = mongoose.Schema({
  name: String,
  firstname: String,
  email: String,
  password: String,
  token: String,
  photoProfil: String,
  role: String,
  siret: Number,
  diplomes: [String],
  villes: [String],
  lieux: [String],
  domaineExpertise: [String],
  presentation: String,
  disponibilité: Boolean,
  eleves: [{ type: mongoose.Schema.Types.ObjectId, ref: "eleves" }],
  programmes: [{ type: mongoose.Schema.Types.ObjectId, ref: "programmes" }],
  exercices: [{ type: mongoose.Schema.Types.ObjectId, ref: "exercices" }],
  abonnement: {
    actif: Boolean,
    type: String,
    debut: Date,
    fin: Date,
  },
  rdv: [
    {
      date: Date,
      heure: String,
      eleve: { type: mongoose.Schema.Types.ObjectId, ref: "eleves" },
    },
  ],
});

const Coach = mongoose.model("coachs", coachSchema);

module.exports = Coach;
