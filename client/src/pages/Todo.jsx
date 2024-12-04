import React, { useState, useEffect } from 'react'
import TaskForm from '../components/TaksForm'
import TaskItem from '../components/TaksItem'
import Header from '../components/Header'
import ToggleThemes from '../components/ToggleThemes'
import { fetchTodos, addTodo, updateTodo, deleteTodo } from '../utils/api'
import { toast } from 'react-toastify'

const Todo = () => {
  const [tasks, setTasks] = useState([])
  const [editingTask, setEditingTask] = useState(null)
  const token = localStorage.getItem('token')

  // โหลดรายการงานเมื่อ Component เริ่มต้น
  useEffect(() => {
    const loadTasks = async () => {
      try {
        const data = await fetchTodos(token)
        setTasks(data)
      } catch (error) {
        console.error(error.message)
      }
    }
    loadTasks()
  }, [token])

  const handleSaveTask = async (taskData) => {
    if (!token) {
      toast.error('Please login to manage tasks.')
      return
    }

    try {
      if (editingTask) {
        // แก้ไขงาน
        const updatedTask = await updateTodo(editingTask._id, taskData, token)
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task._id === updatedTask._id ? updatedTask : task
          )
        )
        setEditingTask(null)
        toast.success('Task updated successfully!')
      } else {
        // เพิ่มงานใหม่
        const newTask = await addTodo(taskData, token)
        setTasks((prevTasks) => [...prevTasks, newTask])
        toast.success('Task added successfully!')
      }
    } catch (error) {
      console.error(error.message)
      toast.error('Failed to save task.')
    }
  }

  const handleEditTask = (task) => {
    setEditingTask(task) // ตั้งค่า Task ที่จะแก้ไข
  }

  const handleDeleteTask = async (id) => {
    if (!token) {
      toast.error('Please login to add a To-Do.') // แจ้งเตือนผู้ใช้
      window.location.href = '/' // เปลี่ยนเส้นทางไปหน้า Login
      return
    }

    try {
      await deleteTodo(id, token)
      setTasks((prevTasks) => prevTasks.filter((task) => task._id !== id))
      toast.success('Task deleted successfully!')
    } catch (error) {
      console.error(error.message)
      toast.error('Failed to delete task.')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('user') // ลบข้อมูล user จาก localStorage
    localStorage.removeItem('token')
    setTasks([])
    window.location.href = '/login'
  }

  return (
    <section className="todo-app h-screen p-8 mx-auto max-w-6xl">
      <Header handleLogout={handleLogout} />
      <ToggleThemes />

      <h2 className="text-3xl font-bold text-center mb-8">My To-Do List</h2>

      <div className="max-w-md mx-auto mb-8">
        <TaskForm onSaveTask={handleSaveTask} editingTask={editingTask} />
      </div>

      <ul className="task-list flex flex-col gap-y-4">
        {tasks.map((task) => (
          <TaskItem
            key={task._id}
            task={task}
            onEdit={handleEditTask}
            onDelete={handleDeleteTask}
          />
        ))}
      </ul>
    </section>
  )
}

export default Todo
