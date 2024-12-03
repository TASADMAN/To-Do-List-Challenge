import React, { useState } from 'react'
import TaskForm from '../components/TaksForm'
import TaskItem from '../components/TaksItem'
import Header from '../components/Header'
import ToggleThemes from '../components/ToggleThemes'

const Todo = () => {
  const [tasks, setTasks] = useState([])

  const addTask = (taskData) => {
    setTasks([...tasks, { ...taskData, id: Date.now(), completed: false }])
  }

  const toggleTaskCompletion = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    )
  }

  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id))
  }

  return (
    <section className="h-screen p-8 mx-auto max-w-6xl px-8">
      <Header />
      <ToggleThemes />
      <h2 className="text-3xl font-bold text-center mb-8">My To-Do List</h2>

      <div className="max-w-md mx-auto mb-8">
        <TaskForm onAddTask={addTask} />
      </div>

      <ul className="flex flex-col gap-y-4">
        {tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            onToggleComplete={toggleTaskCompletion}
            onDelete={deleteTask}
          />
        ))}
      </ul>
    </section>
  )
}

export default Todo
