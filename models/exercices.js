const mongoose = require("mongoose");

const exerciceSchema = mongoose.Schema({
  name: String,
  photo: String,
  video: String,
  description: String,
  ciblage: String,
  utilisationMuscle: Number,
  categorie: String,
});

const Exercice = mongoose.model("exercices", exerciceSchema);

module.exports = Exercice;
