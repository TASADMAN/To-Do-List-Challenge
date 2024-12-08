import React from 'react'
import { FaEdit, FaTrashAlt, FaCheck } from 'react-icons/fa'

const TaskItem = ({ task, onEdit, onDelete, onComplete }) => {
  return (
    <div
      className={`card shadow-md ${
        task.isCompleted
          ? 'bg-green-100 text-green-900'
          : 'bg-base-100 text-base-content'
      }`}
    >
      <div className="card-body">
        <h2 className="card-title">
          {task.title}
          <span
            className={`badge ${
              task.priority === 'High'
                ? 'badge-error'
                : task.priority === 'Medium'
                ? 'badge-warning'
                : 'badge-success'
            }`}
          >
            {task.priority}
          </span>
        </h2>

        {/* Completed Status */}
        {task.isCompleted ? (
          <p className="text-sm text-success">🎉 Task Completed!</p>
        ) : (
          <p className="text-sm text-warning">⏳ Pending Task</p>
        )}

        {/* Actions */}
        <div className="card-actions justify-end">
          {!task.isCompleted && (
            <button
              onClick={() => onComplete(task._id)}
              className="btn btn-sm btn-primary flex items-center gap-1"
            >
              <FaCheck /> Complete
            </button>
          )}
          <button
            onClick={() => onEdit(task)}
            className="btn btn-sm btn-info flex items-center gap-1 text-white"
          >
            <FaEdit />
          </button>
          <button
            onClick={() => onDelete(task._id)}
            className="btn btn-sm btn-error flex items-center gap-1 text-white"
          >
            <FaTrashAlt />
          </button>
        </div>
      </div>
    </div>
  )
}

export default TaskItem
