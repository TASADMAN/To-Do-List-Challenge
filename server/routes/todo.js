import express from "express";
import {
        getAllTodos,
        getTodo,
        updateTodo,
        deleteTodo,
        addTodo,
        rewardUserForTask,
        getHistory,
} from "../controllers/todo.js";
import { verifyToken } from "../utils/verify.js";

const router = express.Router();

// เส้นทางจัดการ History
router.get("/history", verifyToken, getHistory); // ดึงข้อมูล History

// เส้นทางจัดการ Task
router.get("/", verifyToken, getAllTodos); // ดึง Todo ทั้งหมด
router.post("/", verifyToken, addTodo); // เพิ่ม Todo ใหม่
router.put("/:id", verifyToken, updateTodo); // อัปเดต Todo
router.get("/:id", verifyToken, getTodo); // ดึง Todo เดียว
router.delete("/:id", verifyToken, deleteTodo); // ลบ Todo
router.patch("/:id/complete", verifyToken, rewardUserForTask); // กด Complete Task

export default router;
