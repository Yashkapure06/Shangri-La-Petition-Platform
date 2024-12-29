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

// router.post("/create", verifyToken, async (req, res) => {
//   try {
//     const { title, description } = req.body;
//     const userId = req.user.id;

//     const user = await User.findById(userId);

//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     const newPetition = new Petition({
//       title,
//       description,
//       createdBy: userId,
//       username: user.username,
//       // set threshold to current number threshold from th e petition model
//     });

//     await newPetition.save();
//     res.status(201).json({
//       message: "Petition created successfully",
//       petition: newPetition,
//       user: {
//         id: user._id,
//         username: user.username,
//         email: user.email,
//         role: user.role,
//       },
//     });
//   } catch (error) {
//     res.status(500).json({ message: "Error creating petition", error });
//   }
// });
// ROUTE 1: CREATE A PETITION
router.post("/create", verifyToken, async (req, res) => {
  try {
    const { title, description } = req.body;
    const userId = req.user.id;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Fetch the threshold value from the most recent petition (you can change the logic to fetch the threshold as needed)
    const lastPetition = await Petition.findOne().sort({ createdAt: -1 });
    const threshold = lastPetition ? lastPetition.threshold : 0; // Default threshold if no petition exists

    const newPetition = new Petition({
      title,
      description,
      createdBy: userId,
      username: user.username,
      threshold, // Set the threshold to the last petition's threshold or default to 10
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

    // Fetch only petitions with status "open"
    const petitions = await Petition.find({ status: "open" });

    const updatePromises = petitions.map((petition) => {
      petition.threshold = threshold;

      // Check if the number of signatures equals the new threshold
      if (petition.signatures.length >= threshold) {
        petition.status = "closed";
      }

      return petition.save();
    });

    const results = await Promise.all(updatePromises);

    res.status(200).json({
      message: "Global threshold set successfully for open petitions",
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
    res.json(threshold);
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

    // if (petition.signatures.length === petition.threshold) {
    //   petition.status = "closed";
    // }

    await petition.save();
    res.json(petition);
  } catch (error) {
    res.status(500).json({ message: "Error updating petition", error });
  }
});

// ROUTE 6: UPDATE RESPONSE FOR A PETITION BY PETITION ID - here only admin can update the response
router.put("/update-response/:id", verifyToken, async (req, res) => {
  try {
    // take response and status from the body
    const { response, status } = req.body;

    const petition = await Petition.findById(req.params.id);
    if (!petition) {
      return res.status(404).json({ message: "Petition not found" });
    }
    // if petition threshold is equal to the number of signatures, the status should be updated to closed
    if (petition.signatures.length === petition.threshold) {
      petition.status = "closed";
    }
    // update the response and status
    petition.response = response;
    petition.status = status;
    await petition.save();
    res.json(petition);
  } catch (error) {
    res.status(500).json({ message: "Error updating response", error });
  }
});

module.exports = router;
