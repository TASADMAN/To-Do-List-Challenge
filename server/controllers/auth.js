import { createError } from "../utils/error.js";
import { connectToDB } from "../utils/connect.js";
import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Register User
export async function register(req, res, next) {
    try {
        const { email, password, username } = req.body;

        if (!email || !password || !username) {
            return next(createError(400, "Missing required fields: email, password, username"));
        }

        // Connect to DB
        await connectToDB();

        // Check if the user already exists
        const alreadyRegistered = await User.exists({ email });
        if (alreadyRegistered) {
            return next(createError(400, "User already exists."));
        }

        // Hash the password
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(password, salt);

        // Create new user
        const newUser = new User({
            email,
            password: hashedPassword,
            username,
        });

        // Save to DB
        const savedUser = await newUser.save();

        res.status(201).json({
            message: "User registered successfully",
            user: { id: savedUser._id, email: savedUser.email, username: savedUser.username },
        });
    } catch (error) {
        next(createError(500, "Something went wrong while registering"));
    }
}

// Login User
export async function login(req, res, next) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return next(createError(400, "Missing required fields: email and password"));
        }

        // Connect to DB
        await connectToDB();

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return next(createError(400, "Invalid credentials"));
        }

        // Verify password
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return next(createError(400, "Invalid credentials"));
        }

        // Generate JWT token
        const token = jwt.sign({ id: user._id }, process.env.JWT, { expiresIn: "1h" });

        // Set cookie and respond
        res
            .cookie("access_token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
            })
            .status(200)
            .json({
                message: "User logged in successfully",
                user: { id: user._id, email: user.email, username: user.username },
            });
    } catch (error) {
        next(createError(500, "Something went wrong while logging in"));
    }
}

// Logout User
export async function logout(req, res, next) {
    try {
        res
            .clearCookie("access_token", {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
            })
            .status(200)
            .json({ message: "Logged out successfully" });
    } catch (error) {
        next(createError(500, "Something went wrong while logging out"));
    }
}
