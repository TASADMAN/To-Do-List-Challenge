import React, { useState } from 'react'

const TaskForm = ({ onAddTask }) => {
  const [taskData, setTaskData] = useState({
    title: '',
    description: '',
    priority: 'Low',
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setTaskData({ ...taskData, [name]: value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onAddTask(taskData)
    setTaskData({ title: '', description: '', priority: 'Low' })
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="card w-full max-w-md bg-base-100 shadow-lg p-6 rounded-lg space-y-6"
    >
      <h3 className="text-xl font-bold text-center text-primary">
        Add a New Task
      </h3>

      {/* Input Title */}
      <div className="form-control">
        <label className="label">
          <span className="label-text text-base">Task Title</span>
        </label>
        <input
          type="text"
          name="title"
          value={taskData.title}
          onChange={handleChange}
          placeholder="Enter your task title"
          className="input input-bordered"
          required
        />
      </div>

      {/* Textarea Description */}
      <div className="form-control">
        <label className="label">
          <span className="label-text text-base">Task Description</span>
        </label>
        <textarea
          name="description"
          value={taskData.description}
          onChange={handleChange}
          placeholder="Enter a detailed description of your task"
          className="textarea textarea-bordered"
        />
      </div>

      {/* Select Priority */}
      <div className="form-control">
        <label className="label">
          <span className="label-text text-base">Task Priority</span>
        </label>
        <select
          name="priority"
          value={taskData.priority}
          onChange={handleChange}
          className="select select-bordered"
        >
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
      </div>

      {/* Submit Button */}
      <button type="submit" className="btn btn-primary btn-block">
        Add Task
      </button>
    </form>
  )
}

export default TaskForm
