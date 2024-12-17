const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const session = require("express-session");
const passport = require("passport");

const User = require("../models/User");
const { validationResult, body } = require("express-validator");
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

// ROUTE 1: lOGINING IN AS ADMIN
router.post(
  "/admin/login",
  [
    body("email", "Enter a valid email")
      .isEmail()
      .isLength({ min: 6, max: 255 }),
    body("password", "Password is required").exists().isLength({ min: 6 }),
    body("role", "Role is required").exists().isIn(["admin"]),
  ],
  async (req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(400).json({ error: error.array() });
    }

    try {
      const theAdmin = await User.findOne({
        email: req.body.email,
        role: "admin",
      });
      if (theAdmin) {
        const checkHash = await bcrypt.compare(
          req.body.password,
          theAdmin.password
        );
        if (checkHash) {
          let payload = {
            user: {
              id: theAdmin.id,
            },
          };
          const authToken = jwt.sign(payload, JWT_SECRET);
          return res.status(200).json({ authToken });
        } else {
          return res.status(400).json({ error: "Invalid Credentials" });
        }
      } else {
        return res.status(400).json({ error: "Invalid Credentials" });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Server Error" });
    }
  }
);

// ROUTE 2: REGISTERING NEW PETITIONER
router.post(
  "/petitioner/register",
  [
    body("username", "Username is required")
      .exists()
      .isLength({ min: 6, max: 255 }),
    body("email", "Enter a valid email")
      .isEmail()
      .isLength({ min: 6, max: 255 }),
    body("dob", "Date of Birth is required").exists(),
    body("password", "Password is required").exists().isLength({ min: 6 }),
    body("bioId", "BioId is required").exists().isLength({ min: 10, max: 10 }),
    body("role", "Role is required").exists().isIn(["petitioner"]),
  ],
  async (req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(400).json({ error: error.array() });
    }

    try {
      const { username, email, password, bioId, role, dob } = req.body;

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: "User already exists" });
      }
      const existingBioId = await User.findOne({ bioId });
      if (existingBioId) {
        return res.status(400).json({ error: "BioId already exists" });
      }

      const newUser = new User({
        username,
        email,
        password,
        bioId,
        role,
        dob,
      });
      const salt = await bcrypt.genSalt(10);
      newUser.password = await bcrypt.hash(password, salt);
      const token = jwt.sign({ id: newUser._id }, JWT_SECRET);
      await newUser.save();
      // TODO: repove data from response after testing more or create a payload as per requirement
      return res.status(200).json({
        token,
        data: newUser,
        message: "Petitioiner created successfully",
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Server Error" });
    }
  }
);

// ROUTE 3: LOGINING IN AS PETITIONER USING BIOID or EMAIL and PASSWORD
router.post("/petitioner/login", async (req, res) => {
  const { email, password, bioId } = req.body;

  try {
    let petitioner;

    if (bioId) {
      petitioner = await User.findOne({ bioId });
      console.log("1.", petitioner);

      if (!petitioner) {
        return res.status(400).json({ error: "Invalid BioId" });
      }
    } else if (email && password) {
      petitioner = await User.findOne({ email });
      if (!petitioner) {
        return res.status(400).json({ error: "Invalid Email" });
      }
      const checkHash = await bcrypt.compare(password, petitioner.password);

      if (!checkHash) {
        return res.status(400).json({ error: "Invalid Email or Password" });
      }
    } else {
      return res.status(400).json({ error: "Invalid Credentials" });
    }
    console.log("2", petitioner);

    const token = jwt.sign({ id: petitioner._id }, JWT_SECRET);

    //TODO: remove petitioner from resopnse after testing more or create a payload as per requirement
    return res
      .status(200)
      .json({ token, petitioner, message: "Login Successful" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server Error" });
  }
});

module.exports = router;
