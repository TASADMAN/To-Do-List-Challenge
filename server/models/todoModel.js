import mongoose from "mongoose";

const todoSchema = new mongoose.Schema(
    {
        userID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "Todo must have an owner"],
        },
        title: {
            type: String,
            required: [true, "Must provide title."],
            maxlength: [100, "Title must be less than 100 characters."],
            trim: true, // ตัดช่องว่างก่อนและหลัง
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
            type: Date, // เก็บเวลาที่ Task ถูกทำสำเร็จ
        },
        coins: {
            type: Number, // จำนวน Coins ที่ได้จาก Task
            default: 0,
        },
    },
    {
        timestamps: true, // สร้างฟิลด์ createdAt, updatedAt อัตโนมัติ
    }
);

// เพิ่ม Index
todoSchema.index({ userID: 1 });
todoSchema.index({ priority: 1 });
todoSchema.index({ isCompleted: 1 });

// Middleware: ตรวจสอบ Title ก่อนบันทึก
todoSchema.pre("save", function (next) {
    if (!this.title.trim()) {
        throw new Error("Title cannot be empty or just spaces.");
    }
    next();
});

// สร้าง Model
const Todo = mongoose.model("Todo", todoSchema);

export default Todo;
