// library imports
const router = require("express").Router();

// routes
router.get("/", (req, res) => {
  res.render("home.ejs");
});

router.get("/login", (req, res) => {
  res.render("login.ejs");
});

router.get("/register", (req, res) => {
  res.render("register.ejs");
});

// export
module.exports = router;