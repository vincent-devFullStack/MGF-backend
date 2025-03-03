const mongoose = require("mongoose");

const programmeSchema = mongoose.mongoose.Schema({
  name: String,
  seances: Number,
  duree: Number,
  photo: String,
  seances: [[{ type: mongoose.Schema.Types.ObjectId, ref: "exercices" }]],
});

const Programme = mongoose.model("programmes", programmeSchema);

module.exports = Programme;
