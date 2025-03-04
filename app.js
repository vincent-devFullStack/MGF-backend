require("dotenv").config();

var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var indexRouter = require("./routes/index");
var eleveRouter = require("./routes/eleve");
var coachRouter = require("./routes/coach");
var exerciceRouter = require("./routes/exercice");
var programmeRouter = require("./routes/programme");

var app = express();
const cors = require("cors");
app.use(cors());

const fileUpload = require("express-fileupload");
app.use(fileUpload());

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/eleve", eleveRouter);
app.use("/coach", coachRouter);
app.use("/exercice", exerciceRouter);
app.use("/programme", programmeRouter);

module.exports = app;
