const express = require("express");
const router = express.Router();
const session = require("express-session");
const passport = require("passport");

const User = require("../models/User");
const Petition = require("../models/Petition");
const verifyToken = require("../middleware/verifyToken");

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

// ROUTE 1: CREATE A PETITION

router.post("/create", verifyToken, async (req, res) => {
  try {
    const { title, description } = req.body;
    const userId = req.user.id;
    console.log(userId);

    const user = await User.findById(userId);
    console.log(user);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const newPetition = new Petition({
      title,
      description,
      createdBy: userId,
    });

    await newPetition.save();
    res.status(201).json({
      message: "Petition created successfully",
      petition: newPetition,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Error creating petition", error });
  }
});

// ROUTE 2: GET ALL PETITIONS
router.get("/getall", verifyToken, async (req, res) => {
  try {
    const petitions = await Petition.find();
    res.json(petitions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ROUTE 3: UPDATE THRESHOLD GLOBALLY -only admin can do this
router.put("/set-global-threshold", async (req, res) => {
  try {
    const { threshold } = req.body;

    const result = await Petition.updateMany({}, { $set: { threshold } });

    res.status(200).json({
      message: "Global threshold set successfully for all petitions",
      result,
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating global threshold", error });
  }
});

module.exports = router;
