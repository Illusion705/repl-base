// library imports
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const dotEnv = require("dotenv").config();
const session = require("express-session");
const multer = require("multer");
const passport = require("passport");
const MongoStore = require("connect-mongo");
const { GridFsStorage } = require("multer-gridfs-storage");
const fs = require("fs");

// mongoDB models
const User = require("./models/userModel");

// file imports
const mainRouter = require("./routes/main");
const apiRouter = require("./routes/api");

// init passport
const initPassport = require("./config/passport");
initPassport(passport, async username => {
  return (await User.findOne({ lowerCaseUsername: username.toLowerCase() })
    .then(user => {
      if (user && !user.isDeleted) {
        return user;
      } else {
        return null;
      }
    }));
});

// init gfs
const conn = mongoose.connection;
let clusterIconGridFSBucket;

conn.on("connected", () => {
  clusterIconGridFSBucket = new mongoose.mongo.GridFSBucket(conn.db, { bucketName: "cluster-icon-uploads" });
});

// gfs storage engines
// ##########################

// multer upload methods
const uploadBody = multer();

// mongo store
const mongoStore = new MongoStore({
  mongoUrl: process.env.DB_STRING
});

// app config
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use("/public", express.static(path.join(__dirname, "public")));
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  store: mongoStore,
  cookie: {
    secure: true,
    maxAge: 1000 * 60 * 60 * 24 // 1 day
  }
}));

app.set("view engine", "ejs")

// routers
app.use("/", mainRouter);
app.use("/api", apiRouter);

// connect to MongoDB and start app
console.log("Connecting to database...")
mongoose.connect(process.env.DB_STRING)
  .then(() => {
    console.log("Connected to database");
    app.listen(process.env.PORT, () => console.log(`Server listening on port ${process.env.PORT}`));
  })
  .catch(err => {
    console.log("Error connecting to database: \n" + err);
  });