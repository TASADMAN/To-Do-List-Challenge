import React, { useState, useEffect } from 'react'
import TaskForm from '../components/TaksForm'
import TaskItem from '../components/TaksItem'
import Header from '../components/Header'
import ToggleThemes from '../components/ToggleThemes'
import { toast } from 'react-toastify'
import { fetchTodos, addTodo, updateTodo, deleteTodo } from '../utils/api'

const Todo = () => {
  const [tasks, setTasks] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadTasks = async () => {
      const token = localStorage.getItem('token')
      if (!token) {
        toast.error('You must be logged in to view tasks.')
        setIsLoading(false)
        return
      }

      try {
        const fetchedTasks = await fetchTodos(token)
        setTasks(fetchedTasks)
      } catch (error) {
        toast.error(error.message)
      } finally {
        setIsLoading(false)
      }
    }

    loadTasks()
  }, [])

  const handleAddTask = async (taskData) => {
    const token = localStorage.getItem('token')
    if (!token) {
      toast.error('You must be logged in to add tasks.')
      return
    }

    try {
      const newTask = await addTodo(taskData, token)
      setTasks([...tasks, newTask])
      toast.success('Task added successfully!')
    } catch (error) {
      toast.error(error.message)
    }
  }

  const handleToggleComplete = async (id) => {
    const token = localStorage.getItem('token')
    const task = tasks.find((t) => t._id === id)

    try {
      const updatedTask = await updateTodo(
        id,
        { isCompleted: !task.isCompleted },
        token
      )
      setTasks(tasks.map((t) => (t._id === id ? updatedTask : t)))
      toast.success('Task updated successfully!')
    } catch (error) {
      toast.error(error.message)
    }
  }

  const handleDeleteTask = async (id) => {
    const token = localStorage.getItem('token')

    try {
      await deleteTodo(id, token)
      setTasks(tasks.filter((t) => t._id !== id))
      toast.success('Task deleted successfully!')
    } catch (error) {
      toast.error(error.message)
    }
  }

  return (
    <section className="h-screen p-8 mx-auto max-w-6xl">
      <Header />
      <ToggleThemes />
      <h2 className="text-3xl font-bold text-center mb-8">My To-Do List</h2>

      <div className="max-w-md mx-auto mb-8">
        <TaskForm onAddTask={handleAddTask} />
      </div>

      {isLoading ? (
        <p className="text-center">Loading tasks...</p>
      ) : (
        <ul className="flex flex-col gap-y-4">
          {tasks.map((task) => (
            <TaskItem
              key={task._id}
              task={task}
              onToggleComplete={handleToggleComplete}
              onDelete={handleDeleteTask}
            />
          ))}
        </ul>
      )}
    </section>
  )
}

export default Todo
