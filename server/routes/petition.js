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
    const petitions = await Petition.find().sort({ createdAt: -1 });
    res.json(petitions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/getall/:id", verifyToken, async (req, res) => {
  try {
    const petitions = await Petition.find({ createdBy: req.params.id }).sort({
      createdAt: -1,
    });
    res.json(petitions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ROUTE 3: UPDATE THRESHOLD GLOBALLY -only admin can do this
// router.put("/set-global-threshold", async (req, res) => {
//   try {
//     const { threshold } = req.body;

//     const result = await Petition.updateMany(
//       {},

//       { $set: { threshold } }
//     );

//     res.status(200).json({
//       message: "Global threshold set successfully for all petitions",
//       result,
//     });
//   } catch (error) {
//     res.status(500).json({ message: "Error updating global threshold", error });
//   }
// });
router.put("/set-global-threshold", async (req, res) => {
  try {
    const { threshold } = req.body;

    if (threshold <= 0) {
      return res.status(400).json({ message: "Invalid threshold value" });
    }

    const petitions = await Petition.find();
    const updatePromises = petitions.map((petition) => {
      petition.threshold = threshold;

      if (petition.signatures.length === threshold) {
        petition.status = "closed";
      } else if (petition.signatures.length < threshold) {
        petition.status = "open";
      }

      return petition.save();
    });

    const results = await Promise.all(updatePromises);

    res.status(200).json({
      message: "Global threshold set successfully for all petitions",
      updatedPetitions: results,
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating global threshold", error });
  }
});

// ROUTE 4: GET THRESHOLD globally
router.get("/get-global-threshold", async (req, res) => {
  try {
    const threshold = await Petition.find().select("threshold");
    res.json(threshold[0]);
  } catch (error) {
    res.status(500).json({ message: "Error getting global threshold", error });
  }
});

// TODO: ROUTE 5: Update a petition by updating the threshold, status, or signatures
// when threshold matches the number of signatures, the status should be updated to closed automatically and immediately
// as soon as a petition is closed, no more signatures can be added
router.put("/update/:id", verifyToken, async (req, res) => {
  try {
    const { threshold, status, signatures } = req.body;

    const petition = await Petition.findById(req.params.id);
    if (!petition) {
      return res.status(404).json({ message: "Petition not found" });
    }

    if (petition.status === "closed") {
      return res.status(400).json({ message: "Petition is already closed" });
    }

    if (threshold) {
      petition.threshold = threshold;
    }

    if (status) {
      petition.status = status;
    }

    if (signatures) {
      petition.signatures = signatures;
    }

    if (petition.signatures.length === petition.threshold) {
      petition.status = "closed";
    }

    await petition.save();
    res.json(petition);
  } catch (error) {
    res.status(500).json({ message: "Error updating petition", error });
  }
});

// router.put("/update/:id", verifyToken, async (req, res) => {
//   try {
//     const { threshold, status, signatures } = req.body;

//     // Fetch the petition
//     const petition = await Petition.findById(req.params.id);
//     if (!petition) {
//       return res.status(404).json({ message: "Petition not found" });
//     }

//     // If the petition is closed, restrict further updates except status-related
//     if (petition.status === "closed") {
//       return res.status(400).json({ message: "Petition is already closed" });
//     }

//     let isUpdated = false;

//     // Update threshold if provided
//     if (threshold !== undefined) {
//       if (typeof threshold !== "number" || threshold <= 0) {
//         return res.status(400).json({ message: "Invalid threshold value" });
//       }
//       petition.threshold = threshold;
//       isUpdated = true;
//     }

//     // Update status if provided
//     if (status !== undefined) {
//       if (!["open", "closed"].includes(status)) {
//         return res.status(400).json({ message: "Invalid status value" });
//       }
//       petition.status = status;
//       isUpdated = true;
//     }

//     // Update signatures if provided
//     if (signatures !== undefined) {
//       if (!Array.isArray(signatures)) {
//         return res.status(400).json({ message: "Signatures must be an array" });
//       }
//       petition.signatures = signatures;
//       isUpdated = true;
//     }

//     // Automatically close petition if signatures match threshold
//     if (petition.signatures.length >= petition.threshold) {
//       petition.status = "closed";
//       isUpdated = true;
//     }

//     // Save only if there are updates
//     if (isUpdated) {
//       await petition.save();
//     }

//     res.json(petition);
//   } catch (error) {
//     res.status(500).json({ message: "Error updating petition", error });
//   }
// });

module.exports = router;
