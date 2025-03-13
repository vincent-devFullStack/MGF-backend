const mongoose = require("mongoose");

const eleveSchema = mongoose.Schema({
  name: String,
  firstname: String,
  email: String,
  password: String,
  token: String,
  secretWord: String,
  sexe: String,
  taille: Number,
  poids: Number,
  dateNaissance: Date,
  role: String,
  objectif: String,
  morphorlogie: String,
  coach: { type: mongoose.Schema.Types.ObjectId, ref: "coachs" },
  programmes: { type: mongoose.Schema.Types.ObjectId, ref: "programmes" },
  photoProfil: null || String,
  abonnement: {
    actif: Boolean,
    type: String,
    debut: Date,
    fin: Date,
  },
  photos: {
    depart: {
      front: null || String,
      back: null || String,
      profil: null || String,
    },
    actuelles: {
      front: null || String,
      back: null || String,
      profil: null || String,
    },
  },
  bodyDepart: {
    poids: Number,
    cou: Number,
    poitrine: Number,
    biceps: Number,
    taille: Number,
    hanche: Number,
    cuisse: Number,
    mollet: Number,
  },
  bodyActuel: {
    poids: Number,
    cou: Number,
    poitrine: Number,
    biceps: Number,
    taille: Number,
    hanche: Number,
    cuisse: Number,
    mollet: Number,
  },
  skeleton: {
    type: String,
    os: String,
    clavicule: String,
    humerus: String,
    avantBras: String,
    buste: String,
    thorax: String,
    abdomen: String,
    hanches: String,
    femur: String,
    tibia: String,
  },
  muscles: {
    deltoidAnt: {
      insertion: String,
      etat: String,
      potentiel: String,
    },
    deltoidLat: {
      insertion: String,
      etat: String,
      potentiel: String,
    },
    deltoidPost: {
      insertion: String,
      etat: String,
      potentiel: String,
    },
    biceps: {
      insertion: String,
      etat: String,
      potentiel: String,
    },
    triceps: {
      insertion: String,
      etat: String,
      potentiel: String,
    },
    abSup: {
      insertion: String,
      etat: String,
      potentiel: String,
    },
    abPro: {
      insertion: String,
      etat: String,
      potentiel: String,
    },
    trapezeSup: {
      insertion: String,
      etat: String,
      potentiel: String,
    },
    trapezeMoy: {
      insertion: String,
      etat: String,
      potentiel: String,
    },
    trapezeInf: {
      insertion: String,
      etat: String,
      potentiel: String,
    },
    grandDorsal: {
      insertion: String,
      etat: String,
      potentiel: String,
    },
    pectoraux: {
      insertion: String,
      etat: String,
      potentiel: String,
    },
    abdominaux: {
      insertion: String,
      etat: String,
      potentiel: String,
    },
    obliques: {
      insertion: String,
      etat: String,
      potentiel: String,
    },
    cou: {
      insertion: String,
      etat: String,
      potentiel: String,
    },
    quadriceps: {
      insertion: String,
      etat: String,
      potentiel: String,
    },
    ischios: {
      insertion: String,
      etat: String,
      potentiel: String,
    },
    fessiers: {
      insertion: String,
      etat: String,
      potentiel: String,
    },
    abducteurs: {
      insertion: String,
      etat: String,
      potentiel: String,
    },
    mollets: {
      insertion: String,
      etat: String,
      potentiel: String,
    },
    tibias: {
      insertion: String,
      etat: String,
      potentiel: String,
    },
  },
  historique: [
    {
      date: Date,
      presentiel: Boolean,
      heure: { type: Date, default: null },
      exercices: [
        {
          exercice: { type: mongoose.Schema.Types.ObjectId, ref: "exercices" },
          execution: {
            intention: String,
            series: Number,
            repetitionsReco: String || Number,
            repetitions: Number,
            chargeReco: String || Number,
            charge: Number,
            repos: Number,
          },
          intensité: Number,
          commentaire: String,
          videoReq: Boolean,
          effectué: Boolean,
        },
      ],
    },
  ],
  conversations: [
    {
      date: Date,
      firstname: String,
      texte: String,
      role: String,
    },
  ],

  rdv: [
    {
      date: Date,
      heure: String,
      coach: { type: mongoose.Schema.Types.ObjectId, ref: "coachs" },
    },
  ],
});

const Eleve = mongoose.model("eleves", eleveSchema);

module.exports = Eleve;
