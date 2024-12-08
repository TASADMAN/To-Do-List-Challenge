import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true,],
        unique: [true,],
    },
    password: {
        type: String,
        required: [true,],
    },
    username: {
        type: String,
        required: [true,],
    },
    totalCoins: {
        type: Number,
        default: 0,
    },
    history: [
        {
            title: String,
            priority: String,
            completedAt: { type: Date, default: Date.now },
            coins: Number,
        },
    ],

});

const User = mongoose.model("User", userSchema);

export default User;