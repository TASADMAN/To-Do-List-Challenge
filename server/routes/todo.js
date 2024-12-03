import express from "express";
import { getAllTodos, 
         getTodo, 
         updateTodo, 
         deleteTodo, 
         addTodo 
        } from "../controllers/todo.js";
import { verifyToken } from "../utils/verify.js";

const router = express.Router();

router.get("/",verifyToken, getAllTodos);

router.post("/",verifyToken, addTodo);

router.put("/:id",verifyToken, updateTodo);

router.get("/:id",verifyToken, getTodo);

router.delete("/:id",verifyToken, deleteTodo);

export default router;