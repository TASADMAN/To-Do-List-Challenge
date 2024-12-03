import express from "express";
import {
        getAllTodos,
        getTodo,
        updateTodo,
        deleteTodo,
        addTodo
} from "../controllers/todo.js";
import { verifyToken } from "../utils/verify.js";

const router = express.Router();

// Route สำหรับจัดการ Todo
router.get("/", verifyToken, getAllTodos); // ดึง Todo ทั้งหมด
router.post("/", verifyToken, addTodo); // เพิ่ม Todo ใหม่
router.put("/:id", verifyToken, updateTodo); // อัปเดต Todo ที่ระบุ
router.get("/:id", verifyToken, getTodo); // ดึง Todo เดียว
router.delete("/:id", verifyToken, deleteTodo); // ลบ Todo

export default router;
