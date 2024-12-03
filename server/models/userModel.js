import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, "Must provide an email."],
        unique: [true, "Email must be unique."],
    },
    password: {
        type: String,
        required: [true, "Musst provide password."],
    },
    username: {
        type: String,
        required: [true, "Musst provide username."],
    },
});

const User = mongoose.model("User", userSchema);

export default User;