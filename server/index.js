require("dotenv").config();
const express = require("express");
const cors = require("cors");
const User = require("./models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const connectToMongo = require("./db");

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
        email: process.env.ADMIN_EMAIL,
        password: process.env.ADMIN_PASSWORD,
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

seedAdminUser();
app.get("/", (req, res) => {
  res.json({ message: "Server Started", connection: "Connected to MongoDB" });
});
app.use("/api/auth", require("./routes/auth"));
app.use("/api", require("./routes/user"));
app.use("/api/petition", require("./routes/petition"));

app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
