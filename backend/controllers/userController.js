import User from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const registerUser = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      confirmPassword,
      collegeName,
      branch,
      program,
    } = req.body;

    if (
      !name ||
      !email ||
      !password ||
      !confirmPassword ||
      !collegeName ||
      !branch ||
      !program
    ) {
      return res
        .status(400)
        .json({ message: "All fields are required", success: false });
    }

    if (password !== confirmPassword) {
      return res
        .status(400)
        .json({ message: "Passwords do not match", success: false });
    }

    // Normalize email to lowercase
    const emailNormalized = email.toLowerCase();

    const hashedPassword = await bcrypt.hash(password, 12);
    //profilePic

    await User.create({
      name,
      email,
      password: hashedPassword,
      collegeName,
      branch,
      program,
    });
    return res
      .status(201)
      .json({ message: "User created successfully", success: true });
  } catch (error) {
    // console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(400).json({ message: "User does not exist" });
    }
    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!isPasswordCorrect) {
      return res
        .status(400)
        .json({ message: "Invalid credentials", success: false });
    }
    const tokenData = {
      id: existingUser._id,
      email: existingUser.email,
      name: existingUser.name,
       collegeName: existingUser.collegeName,
      branch: existingUser.branch,
      program: existingUser.program,
    };

    const token = await jwt.sign(tokenData, process.env.SESSION_SECRET, {
      expiresIn: "7d",
    });

    return res
      .status(200)
      .cookie("token", token, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        sameSite: "strict",
      })
      .json({
        message: "User logged in successfully",
        success: true,
        token,
        _id: existingUser._id,
        name: existingUser.name,
        email: existingUser.email,
      });
  } catch (error) {
    // console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const logoutUser = async (req, res) => {
  try {
    return res
      .status(200)
      .cookie("token", "", {
        httpOnly: true,
        maxAge: 0,
      })
      .json({ message: "User logged out successfully", success: true });
  } catch (error) {
    // console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');// Exclude password
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({ user });
  } catch (error) {
    // console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

