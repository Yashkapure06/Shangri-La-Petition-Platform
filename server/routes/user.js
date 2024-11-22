const express = require("express");
const router = express.Router();
const session = require("express-session");
const passport = require("passport");

const User = require("../models/User");
const verifyToken = require("../middleware/verifyToken");
require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET;
router.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false,
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);
router.use(passport.initialize());
router.use(passport.session());

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

// ROUTE 1: GET ALL PETITIONERS
router.get("/getall/petitioners", verifyToken, async (req, res) => {
  try {
    const petitioners = await User.find({ role: "petitioner" });
    res.json(petitioners);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ROUTE 2: GET PETITIONER BY ID
router.get("/get/petitioner/:id", verifyToken, async (req, res) => {
  try {
    const petitioner = await User.findById(req.params.id);
    res.json(petitioner);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
