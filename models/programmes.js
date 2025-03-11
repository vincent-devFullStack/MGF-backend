const mongoose = require("mongoose");

const programmeSchema = mongoose.mongoose.Schema({
  name: String,
  duree: Number,
  description: String,
  photo: String,
  seances: Number,
  exercices: [
    [
      [
        {
          exercice: { type: mongoose.Schema.Types.ObjectId, ref: "exercices" },
          series: Number,
          repetitions: Number,
          name: String,
        },
      ],
    ],
  ],
});

const Programme = mongoose.model("programmes", programmeSchema);

module.exports = Programme;
