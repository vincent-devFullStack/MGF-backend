const request = require("supertest");
const app = require("./app");

const { MongoClient, ServerApiVersion } = require("mongodb");
const connectionString = process.env.CONNECTION_STRING;

const client = new MongoClient(connectionString, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const coachMockData = {
  name: "test",
  firstname: "test",
  email: "testcoachjest@hotmail.fr",
  password: "test",
  secretWord: "test",
  token: "test",
  photoProfil:
    "https://res.cloudinary.com/dekp6j8uk/image/upload/v1741943019/jx1stbhrvifcfz1h2gpx.jpg",
  role: "coach",
  siret: "25698745892123",
  diplomes: "test",
  villes: "test",
  lieux: "test",
  domaineExpertise: "test",
  abonnement: false,
  presentation: "test",
};

const coachMockDataWithMissingField = {
  name: "test",
  firstname: "test",
  password: "test",
  secretWord: "test",
  token: "test",
  photoProfil:
    "https://res.cloudinary.com/dekp6j8uk/image/upload/v1741943019/jx1stbhrvifcfz1h2gpx.jpg",
  role: "coach",
  siret: "25698745892123",
  diplomes: "test",
  villes: "test",
  lieux: "test",
  domaineExpertise: "test",
  abonnement: false,
  presentation: "test",
};

const connexion = {
  email: "testelevejest@hotmail.fr",
  password: "test",
};

describe("POST /signupCoach", () => {
  test("Retourne true si l'utilisateur est créé avec succès", async () => {
    await client.connect();

    const res = await request(app).post("/signupCoach").send(coachMockData);

    expect(res.statusCode).toBe(200);
    expect(res.body.result).toBe(true);
  });

  test("Retourne false si l'utilisateur existe déjà", async () => {
    await client.connect();

    const res = await request(app).post("/signupCoach").send(coachMockData);

    expect(res.statusCode).toBe(200);
    expect(res.body.result).toBe(false);
    expect(res.body.error).toBe("User already exists");
  });

  test("Retourne false si un ou plusieurs champs sont manquants", async () => {
    await client.connect();

    const res = await request(app)
      .post("/signupCoach")
      .send(coachMockDataWithMissingField);

    expect(res.statusCode).toBe(200);
    expect(res.body.result).toBe(false);
    expect(res.body.error).toBe("Missing or empty fields");
  });
});

const eleveMockData = {
  name: "test",
  firstname: "test",
  email: "testelevejest@hotmail.fr",
  password: "test",
  secretWord: "test",
  role: "eleve",
  objectif: "test",
  sexe: "homme",
  dateNaissance: "1986-12-31T23:00:00.000+00:00",
  poids: 80,
  taille: 180,
};

const eleveMockDataWithMissingField = {
  name: "test",
  firstname: "test",
  email: "testelevejest@hotmail.fr",
  password: "test",
  role: "eleve",
  objectif: "test",
  sexe: "homme",
  dateNaissance: "1986-12-31T23:00:00.000+00:00",
  poids: 80,
  taille: 180,
};

describe("POST /signupEleve", () => {
  test("Retourne true si l'utilisateur est créé avec succès", async () => {
    await client.connect();

    const res = await request(app).post("/signupEleve").send(eleveMockData);

    expect(res.statusCode).toBe(200);
    expect(res.body.result).toBe(true);
  });

  test("Retourne false si l'utilisateur existe déjà", async () => {
    await client.connect();

    const res = await request(app).post("/signupEleve").send(eleveMockData);

    expect(res.statusCode).toBe(200);
    expect(res.body.result).toBe(false);
    expect(res.body.error).toBe("User already exists");
  });

  test("Retourne false si un ou plusieurs champs sont manquants", async () => {
    await client.connect();

    const res = await request(app)
      .post("/signupEleve")
      .send(eleveMockDataWithMissingField);

    expect(res.statusCode).toBe(200);
    expect(res.body.result).toBe(false);
    expect(res.body.error).toBe("Missing or empty fields");
  });

  describe("POST /signinEleve", () => {
    test("Retourne true si l'utilisateur se connecte avec succès", async () => {
      const res = await request(app).post("/signinEleve").send(connexion);

      expect(res.status).toBe(200);
      expect(res.body.result).toBe(true);
    });

    test("Retourne false si l'identifiant ou le mot de passe n'est pas bon", async () => {
      const res = await request(app).post("/signinEleve").send({
        email: "testFalse@hotmail.fr",
        password: "test",
      });

      expect(res.status).toBe(200);
      expect(res.body.result).toBe(false);
      expect(res.body.error).toBe("User not found or wrong password");
    });
  });
});
