import React, { useState, useEffect } from 'react'
import TaskForm from '../components/TaksForm'
import TaskItem from '../components/TaksItem'
import Header from '../components/Header'
import ToggleThemes from '../components/ToggleThemes'
import { fetchTodos, addTodo, updateTodo, deleteTodo } from '../utils/api'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

const Todo = () => {
  const [tasks, setTasks] = useState([])
  const [editingTask, setEditingTask] = useState(null)
  const token = localStorage.getItem('token')
  const navigate = useNavigate()

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
        const updatedTask = await updateTodo(editingTask._id, taskData, token)
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task._id === updatedTask._id ? updatedTask : task
          )
        )
        setEditingTask(null)
        toast.success('Task updated successfully!')
      } else {
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
    setEditingTask(task)
  }

  const handleDeleteTask = async (id) => {
    if (!token) {
      toast.error('Please login to add a To-Do.')
      window.location.href = '/'
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

  const handleCompleteTask = async (id) => {
    if (!token) {
      toast.error('Please login to complete tasks.')
      return
    }

    try {
      const res = await fetch(
        `http://localhost:3000/api/todos/${id}/complete`,
        {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      )

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.message || 'Failed to complete task.')
      }

      const data = await res.json()
      setTasks((prevTasks) => prevTasks.filter((task) => task._id !== id))
      toast.success(`Task completed! You earned ${data.coins} coins.`)

      navigate('/history')
    } catch (error) {
      console.error(error.message)
      toast.error('Failed to complete task.')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    setTasks([])
    window.location.href = '/login'
  }

  return (
    <section className="todo-app h-screen p-8 mx-auto max-w-6xl">
      <Header handleLogout={handleLogout} />
      <div className="container mx-auto flex justify-between items-center px-4">
        <ToggleThemes />
      </div>

      <h2 className="text-3xl font-bold text-center mb-8">My To-Do List</h2>

      <div className="max-w-md mx-auto mb-8">
        <TaskForm onSaveTask={handleSaveTask} editingTask={editingTask} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tasks.map((task) => (
          <TaskItem
            key={task._id}
            task={task}
            onEdit={handleEditTask}
            onDelete={handleDeleteTask}
            onComplete={handleCompleteTask}
          />
        ))}
      </div>
    </section>
  )
}

export default Todo
