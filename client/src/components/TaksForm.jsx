import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { toast } from 'react-toastify'
import { saveTodo } from '../utils/api'

const TaskForm = ({ existingTodo, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    priority: 'Low',
    isCompleted: false,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (existingTodo) {
      setFormData({
        title: existingTodo.title,
        priority: existingTodo.priority,
        isCompleted: existingTodo.isCompleted,
      })
    }
  }, [existingTodo])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const token = localStorage.getItem('token')
    if (!token) {
      toast.error('You must be logged in to add or update tasks.')
      return
    }

    try {
      setIsSubmitting(true)

      const savedTask = await saveTodo(formData, token, existingTodo)

      toast.success(
        existingTodo ? 'Task updated successfully!' : 'Task added successfully!'
      )

      onSave(savedTask)
    } catch (error) {
      toast.error(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="card p-6 bg-base-100 shadow-lg">
      <h2 className="text-lg font-bold mb-4">
        {existingTodo ? 'Edit Task' : 'Add New Task'}
      </h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="form-control">
          <label className="label">
            <span className="label-text">Title</span>
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="input input-bordered"
            placeholder="Enter task title"
            required
          />
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Priority</span>
          </label>
          <select
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            className="select select-bordered"
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>

        {existingTodo && (
          <div className="form-control flex items-center">
            <label className="cursor-pointer label">
              <span className="label-text">Mark as Completed</span>
              <input
                type="checkbox"
                name="isCompleted"
                checked={formData.isCompleted}
                onChange={handleChange}
                className="checkbox"
              />
            </label>
          </div>
        )}

        <div className="flex gap-4">
          <button
            type="submit"
            className={`btn btn-primary flex-1 ${
              isSubmitting ? 'loading' : ''
            }`}
            disabled={isSubmitting}
          >
            {existingTodo ? 'Update Task' : 'Add Task'}
          </button>
          {onCancel && (
            <button
              type="button"
              className="btn btn-secondary flex-1"
              onClick={onCancel}
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  )
}

TaskForm.propTypes = {
  existingTodo: PropTypes.object,
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func,
}

export default TaskForm
