const mongoose = require("mongoose");

const bioIdSchema = new mongoose.Schema({
  bioId: { type: String, unique: true, required: true },
  status: {
    type: String,
    enum: ["in use", "not in use"],
    default: "not in use",
  },
});

const BioId = mongoose.model("BioId", bioIdSchema);

module.exports = BioId;
