import express from "express";
import bcrypt from "bcrypt";

// This will help us connect to the database
import db from "../db/connection.js";

import jwt from "jsonwebtoken";

// This help convert the id from string to ObjectId for the _id.
//import { ObjectId } from "mongodb";

// router is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /record.
const router = express.Router();
const SECRET_KEY = process.env.JWT_SECRET || "fallback_secret_key";

//admin login
router.post("/", async (req, res) => {
  const { username, password } = req.body;

  try {
    const collection = db.collection("adminAuth");
    const admin = await collection.findOne({ username }); //find if username exist in db

    if (!admin) {
      return res.json({ success: false, message: "Invalid username" });
    }

    // Compare the entered password with the hashed password in DB
    const isMatch = await bcrypt.compare(password, admin.password);

    if (isMatch) {
      const adminToken = jwt.sign({ id: admin._id, username: admin.username }, SECRET_KEY, { expiresIn: "1h" });
      res.json({ success: true, message: "Login successful", adminToken });
    } else {
      res.json({ success: false, message: "Invalid password" });
    }
  } catch (err) {
    console.error("Login error:", err);
    res.json({ success: false, message: "Internal server error" });
  }
});


export default router;