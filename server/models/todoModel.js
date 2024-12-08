import mongoose from "mongoose";

const todoSchema = new mongoose.Schema(
    {
        userID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true,],
        },
        title: {
            type: String,
            required: [true,],
            maxlength: [100,],
            trim: true,
        },
        isCompleted: {
            type: Boolean,
            default: false,
        },
        priority: {
            type: String,
            enum: ["Low", "Medium", "High"],
            default: "Low",
        },
        completedAt: {
            type: Date,
        },
        coins: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);


todoSchema.index({ userID: 1 });
todoSchema.index({ priority: 1 });
todoSchema.index({ isCompleted: 1 });

//  Middleware จะตรวจสอบ Title ก่อนบันทึก
todoSchema.pre("save", function (next) {
    if (!this.title.trim()) {
        throw new Error("Title cannot be empty or just spaces.");
    }
    next();
});

const Todo = mongoose.model("Todo", todoSchema);

export default Todo;
