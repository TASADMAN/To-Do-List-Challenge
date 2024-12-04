const BASE_URL = "http://localhost:3000/api/todos";

export const saveTodo = async (taskData, token, existingTodo = null) => {
    if (!taskData || !token) {
        throw new Error("Task data and token are required");
    }

    const apiUrl = existingTodo
        ? `${BASE_URL}/${existingTodo._id}`
        : BASE_URL;
    const method = existingTodo ? "PUT" : "POST";

    const res = await fetch(apiUrl, {
        method,
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(taskData),
    });

    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to save todo");
    }

    return res.json();
};

export const fetchTodos = async (token) => {
    if (!token) {
        throw new Error("Token is required to fetch todos");
    }

    const res = await fetch(BASE_URL, {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    });

    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to fetch tasks");
    }

    return res.json();
};

export const addTodo = async (taskData, token) => {
    if (!taskData || !token) {
        throw new Error("Task data and token are required");
    }

    const res = await fetch(BASE_URL, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(taskData),
    });

    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to add todo");
    }

    return res.json();
};

export const updateTodo = async (id, updates, token) => {
    const res = await fetch(`${BASE_URL}/${id}`, {
        method: "PUT",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
    });

    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to update task");
    }

    return res.json(); // ตรวจสอบว่าข้อมูลที่ส่งคืนคือ Task ที่อัปเดตแล้ว
};

export const deleteTodo = async (id, token) => {
    if (!id || !token) {
        throw new Error("Todo ID and token are required");
    }

    const res = await fetch(`${BASE_URL}/${id}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    });

    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to delete task");
    }
};


export const fetchTodo = async (todoId) => {
    if (!todoId) {
        throw new Error("Todo ID is required to fetch a specific todo");
    }

    try {
        const token = localStorage.getItem("token"); // ดึง Token จาก Local Storage
        const res = await fetch(`http://localhost:3000/api/todos/${todoId}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        if (!res.ok) {
            throw new Error("Failed to fetch todo");
        }

        const data = await res.json();
        return data;
    } catch (error) {
        console.error("Error fetching todo:", error.message);
        throw error;
    }
};
