import jwt from "jsonwebtoken";
import { createError } from "./error.js";

export const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = req.cookies?.access_token || (authHeader && authHeader.split(" ")[1]);

    console.log("Token received:", token);

    if (!token) {
        return next(createError(401, "Not Authenticated!")); // ไม่มี Token
    }

    jwt.verify(token, process.env.JWT, (err, user) => {
        if (err) {
            console.error("JWT Error:", err.message); // Debug Error
            return next(createError(403, "Token is not valid"));
        }
        req.user = user; // เก็บข้อมูล User ใน req.user
        next();
    });
};
