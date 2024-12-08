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

//  History
router.get("/history", verifyToken, getHistory);

//  Task
router.get("/", verifyToken, getAllTodos);
router.post("/", verifyToken, addTodo);
router.put("/:id", verifyToken, updateTodo);
router.get("/:id", verifyToken, getTodo);
router.delete("/:id", verifyToken, deleteTodo);
router.patch("/:id/complete", verifyToken, rewardUserForTask);

export default router;
