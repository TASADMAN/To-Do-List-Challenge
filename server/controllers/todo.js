import { connectToDB } from "../utils/connect.js";
import { createError } from "../utils/error.js";
import Todo from "../models/todoModel.js";
// import User from "../models/userModel.js";


export async function getAllTodos(req, res, next) {
    await connectToDB();
    try {
        const todos = await Todo.find({ userID: req.user.id, isCompleted: false });
        res.status(200).send(todos);
    } catch (error) {
        next(createError(500, "Failed to fetch todos."));
    }
}





export async function getTodo(req, res, next) {
    try {
        await connectToDB();
        const todo = await Todo.findById(req.params.id);
        if (!todo) return next(createError(404, "Todo not found!"))
        // ตรวจสอบ Task เป็นของผู้ใช้ที่เข้าสู่ระบบมาแล้วหรือยัง
        if (todo.userID.toString() !== req.user.id)
            return next(createError(404, "Not athorized!"))
        res.status(200).send(todo);

    } catch (error) {
        next(createError(404, "Todo not found!"))
    }

}

export async function updateTodo(req, res, next) {
    const { title, isCompleted, priority } = req.body;
    const id = req.params.id;

    try {
        const updatedTodo = await Todo.findByIdAndUpdate(
            id,
            { title, isCompleted, priority },
            { new: true }
        );

        if (!updatedTodo) {
            return res.status(404).json({ error: "Todo not found" });
        }

        res.status(200).json(updatedTodo);
    } catch (error) {
        next(error);
    }
}



export async function deleteTodo(req, res, next) {
    try {
        await connectToDB()
        const todo = await Todo.deleteOne({
            _id: req.params.id,
            userID: req.user.id,
        });
        if (!todo.deletedCount)
            return next(createError(404, "Title is required"))
        res.status(200).json({ message: "Todo deleted!" });
    } catch (error) {
        return next(createError(404, "Todo not found!"))
    }
}

export async function addTodo(req, res, next) {
    // console.log("Incoming Data:", req.body);
    const { title, priority } = req.body;

    if (!title) {
        return next(createError(400, "Title is required"));
    }

    try {
        const newTodo = new Todo({
            title,
            priority: priority || "Low",
            userID: req.user.id,
        });
        await newTodo.save();
        res.status(201).json(newTodo);
    } catch (error) {
        console.error("Error in addTodo:", error.message);
        next(createError(500, "Failed to create the Todo"));
    }
}

export async function rewardUserForTask(req, res, next) {
    const { id } = req.params;

    try {
        const task = await Todo.findById(id);

        if (!task) {
            return res.status(404).json({ error: "Task not found" });
        }

        if (task.userID.toString() !== req.user.id) {
            return res.status(403).json({ error: "Not authorized to complete this task." });
        }

        if (task.isCompleted) {
            return res.status(400).json({ error: "Task already completed." });
        }


        let coins = 0;
        switch (task.priority) {
            case "Low":
                coins = 3;
                break;
            case "Medium":
                coins = 5;
                break;
            case "High":
                coins = 10;
                break;
        }

        // อัปเดต Task
        task.isCompleted = true;
        task.completedAt = new Date();
        task.coins = coins;
        await task.save();


        const completedTasks = await Todo.find({ userID: req.user.id, isCompleted: true });
        const totalCoins = completedTasks.reduce((acc, task) => acc + task.coins, 0);

        res.status(200).json({
            message: "Task completed successfully!",
            coins,
            totalCoins,
        });
    } catch (error) {
        next(createError(500, "Failed to complete the task."));
    }
}



export async function getHistory(req, res, next) {
    try {
        const completedTasks = await Todo.find({
            userID: req.user.id,
            isCompleted: true
        }).select("title priority completedAt coins").sort({ completedAt: -1 });

        res.status(200).json(completedTasks);
    } catch (error) {
        next(createError(500, "Failed to fetch completed history"));
    }
}

