const mongoose = require("mongoose");

const exerciceSchema = mongoose.Schema({
  name: String,
  description: String,
  photo: String,
  video: String,
  ciblage: String,
  utilisationMuscle: Number,
  categorie: String,
});

const Exercice = mongoose.model("exercices", exerciceSchema);

module.exports = Exercice;
