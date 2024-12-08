import { createError } from "../utils/error.js";
import { connectToDB } from "../utils/connect.js";
import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


export async function register(req, res, next) {
    try {
        const { email, password, username } = req.body;

        if (!email || !password || !username) {
            return next(createError(400, "Missing required fields: email, password, username"));
        }


        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return next(createError(400, "Invalid email format"));
        }


        await connectToDB();


        const alreadyRegistered = await User.exists({ email });
        if (alreadyRegistered) {
            return next(createError(400, "User already exists."));
        }


        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            email,
            password: hashedPassword,
            username,
        });


        const savedUser = await newUser.save();

        res.status(201).json({
            message: "User registered successfully",
            user: { id: savedUser._id, email: savedUser.email, username: savedUser.username },
        });
    } catch (error) {
        next(createError(500, "Something went wrong while registering"));
    }
}


export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: "Missing required fields: email and password" });
        }


        await connectToDB();

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: "Invalid credentials" });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ error: "Invalid credentials" });
        }


        const token = jwt.sign({ id: user._id }, process.env.JWT, { expiresIn: "1h" });

        res.status(200).json({
            message: "Login successful",
            token,
            user: { id: user._id, email: user.email, username: user.username },
        });
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ error: "Something went wrong while logging in" });
    }
};





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
