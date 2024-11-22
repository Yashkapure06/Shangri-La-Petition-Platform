const verifyPetitioner = (req, res, next) => {
  if (req.user && req.User.role === "petitioner") {
    next();
  } else {
    res.status(403).json({ message: "Access denied." });
  }
};

module.exports = verifyPetitioner;
