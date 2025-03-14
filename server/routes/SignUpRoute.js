import express from "express";
import User from "../models/User.models.js";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import transporter from "../config/NodeMailer.js"; 
dotenv.config();

const router = express.Router();
const otpStore = new Map();

const emailPattern = /@sggs\.ac\.in$/;
const rollnoPattern = /^\d{4}[a-zA-Z]{3}\d{3}$/;

router.post('/api/send-otp', async (req, res) => {
  try {
    const { email, name, rollno } = req.body;

    if (!email || !name || !rollno) {
      return res.status(400).send({ message: "Email, name, roll number, and type are required" });
    }

    if (!emailPattern.test(email)) {
      return res.status(400).send({ message: "Email must be from the sggs.ac.in domain." });
    }

    if (!rollnoPattern.test(rollno)) {
      return res.status(400).send({ message: "Roll number must follow the format YYYYXXXNNN." });
    }

    const otp = crypto.randomInt(1000, 9999).toString();
    otpStore.set(email, { otp, expiresAt: Date.now() + 2 * 60 * 1000 }); // OTP expires in 2 minutes
    await transporter.sendMail({
      from: 'your-email@gmail.com',
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP is ${otp}. It is valid for 2 minutes.`,
    });

    console.log(`OTP sent to ${email}: ${otp}`);
    res.status(200).send({ message: "OTP sent successfully" });
  } catch (error) {
    console.error("Error sending OTP:", error);
    res.status(500).send({ message: "Error sending OTP" });
  }
});

router.post('/api/verify-otp', (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).send({ message: "Email and OTP are required" });
    }

    const storedOtpData = otpStore.get(email);
    if (!storedOtpData) {
      return res.status(400).send({ message: "OTP expired or not found" });
    }
    if (storedOtpData.otp !== otp) {
      return res.status(400).send({ message: "Invalid OTP" });
    }

    if (storedOtpData.expiresAt < Date.now()) {
      otpStore.delete(email); 
      return res.status(400).send({ message: "OTP expired" });
    }

    otpStore.delete(email); 
    res.status(200).send({ success: true, message: "OTP verified successfully" });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    res.status(500).send({ message: "Error verifying OTP" });
  }
});

router.post('/api/users', async (req, res) => {
  try {
    const { email, password, rollno, name } = req.body;

    if (!email || !password || !rollno || !name) {
      return res.status(400).send({ message: "Email, password, name, roll number, and type are required" });
    }

    if (!emailPattern.test(email)) {
      return res.status(400).send({ message: "Email must be from the sggs.ac.in domain." });
    }

    if (!rollnoPattern.test(rollno)) {
      return res.status(400).send({ message: "Roll number must follow the format YYYYXXXNNN." });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const username = `${name.toLowerCase()}${crypto.randomInt(1000, 9999)}`;

    const newUser = new User({
      name: name,
      rollno: rollno,
      email: email,
      type: "Student",
      username: username,
      password: hashedPassword,
    });

    await newUser.save();

    console.log("User saved:", newUser);
    res.status(201).send({ message: "User registered successfully", username });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).send({ message: "Error registering user" });
  }
});

export default router;
