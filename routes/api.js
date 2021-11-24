// library imports
const router = require("express").Router();

// mongoDB models
const User = require("../models/userModel");

// routes
router.get("/username/:username", (req, res) => {
  if (req.params.username == "taken") {
    res.json({ status: "taken" });
  } else {

  User.findOne({ lowercaseUsername: req.params.username })
    .then(user => {
      if (user) {
        res.json({ status: "taken" });
      } else {
        res.json({ status: "available" });
      }
    });

  }
});

// export
module.exports = router;