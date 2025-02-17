// Importing express
const express = require("express");
require("dotenv").config();

// Imnporting routes
const adminRoutes = require("./routes/adminRoutes");
const userRoutes = require("./routes/userRoutes");

// Importing middlewares
const cors = require("cors");
const bodyParser = require("body-parser");

// importing db
const db = require("./util/database");
const app = express();

// Applying middlewares
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// applying routes
app.use("/admin", adminRoutes);
app.use("/user", userRoutes);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// when a random route is inputed
app.use("*", (req, res) => {
  res.status(500).send({ message: "Route is not present" });
});

// associtaions
require("./relations/relations")();

// sync database and listen
db
  .sync
  // { force: true }
  ()
  .then(() => {
    app.listen(process.env.RUNNING_PORT || 5000, () => {
      console.log("App Started ..");
    });
  })
  .catch((err) => console.log(err));
