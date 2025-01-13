require("dotenv").config();
const express = require("express");
const cors = require("cors");
const User = require("./models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const connectToMongo = require("./db");
const BioId = require("./models/BioId");

const app = express();

const PORT = process.env.PORT || 8181;

app.use(express.json());
app.use(cors());

connectToMongo();
const seedAdminUser = async () => {
  try {
    const existingAdmin = await User.findOne({ role: "admin" });

    if (!existingAdmin) {
      const adminUser = new User({
        username: "admin",
        email: process.env.ADMIN_EMAIL || "admin@petition.parliament.sr",
        password: process.env.ADMIN_PASSWORD || "2025%shangrila",
        role: "admin",
      });
      const salt = await bcrypt.genSalt(10);
      adminUser.password = await bcrypt.hash(adminUser.password, salt);

      await adminUser.save();
      console.log("Admin user created successfully");
    } else {
      console.log("Admin user already exists");
    }
  } catch (error) {
    console.error("Error creating admin user:", error);
  }
};

const populateDatabase = async () => {
  const bioIds = [
    "K1YL8VA2HG",
    "7DMPYAZAP2",
    "D05HPPQNJ4",
    "2WYIM3QCK9",
    "DHKFIYHMAZ",
    "LZK7P0X0LQ",
    "H5C98XCENC",
    "6X6I6TSUFG",
    "QTLCWUS8NB",
    "Y4FC3F9ZGS",
    "V30EPKZQI2",
    "O3WJFGR5WE",
    "SEIQTS1H16",
    "X16V7LFHR2",
    "TLFDFY7RDG",
    "PGPVG5RF42",
    "FPALKDEL5T",
    "2BIB99Z54V",
    "ABQYUQCQS2",
    "9JSXWO4LGH",
    "QJXQOUPTH9",
    "GOYWJVDA8A",
    "6EBQ28A62V",
    "30MY51J1CJ",
    "FH6260T08H",
    "JHDCXB62SA",
    "O0V55ENOT0",
    "F3ATSRR5DQ",
    "1K3JTWHA05",
    "FINNMWJY0G",
    "CET8NUAE09",
    "VQKBGSE3EA",
    "E7D6YUPQ6J",
    "BPX8O0YB5L",
    "AT66BX2FXM",
    "1PUQV970LA",
    "CCU1D7QXDT",
    "TTK74SYYAN",
    "4HTOAI9YKO",
    "PD6XPNB80J",
    "BZW5WWDMUY",
    "340B1EOCMG",
    "CG1I9SABLL",
    "49YFTUA96K",
    "V2JX0IC633",
    "C7IFP4VWIL",
    "RYU8VSS4N5",
    "S22A588D75",
    "88V3GKIVSF",
    "8OLYIE2FRC",
  ];

  try {
    for (const bioId of bioIds) {
      const existingBioId = await BioId.findOne({ bioId });
      if (!existingBioId) {
        await BioId.create({ bioId });
      }
    }
    console.log("All Bio IDs populated successfully");
  } catch (error) {
    console.error("Error populating Bio IDs:", error);
  }
};

seedAdminUser();
populateDatabase();

app.get("/", (req, res) => {
  res.json({ message: "Server Started", connection: "Connected to MongoDB" });
});
app.use("/api/auth", require("./routes/auth"));
app.use("/api", require("./routes/user"));
app.use("/api/petition", require("./routes/petition"));

app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
