import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { fetchTodo } from '../utils/api' // นำเข้า fetchTodo

const TaskItem = ({ taskId, onToggleComplete, onDelete }) => {
  const [task, setTask] = useState(null) // สถานะสำหรับเก็บข้อมูล task
  const [isLoading, setIsLoading] = useState(true) // สถานะ Loading
  const [isProcessing, setIsProcessing] = useState(false) // สถานะปุ่ม Loading
  const [error, setError] = useState(null) // สถานะ Error

  // โหลด Task จาก API
  useEffect(() => {
    const loadTask = async () => {
      if (!taskId) {
        setError('Todo ID is required')
        setIsLoading(false)
        return
      }

      try {
        setError(null)
        const fetchedTask = await fetchTodo(taskId) // ดึงข้อมูลจาก API
        setTask(fetchedTask)
      } catch (error) {
        console.error('Error loading task:', error.message)
        setError('Failed to load task. Please try again.')
      } finally {
        setIsLoading(false) // ปิดสถานะ Loading
      }
    }

    loadTask()
  }, [taskId])

  // จัดการ Priority Badge
  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'High':
        return 'badge-error'
      case 'Medium':
        return 'badge-warning'
      default:
        return 'badge-success'
    }
  }

  const handleToggleComplete = async () => {
    setIsProcessing(true)
    await onToggleComplete(task._id) // เรียกใช้งานฟังก์ชันจาก Parent
    setIsProcessing(false)
  }

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      setIsProcessing(true)
      await onDelete(task._id) // เรียกใช้งานฟังก์ชันจาก Parent
      setIsProcessing(false)
    }
  }

  // แสดง Loading หรือ Error
  if (isLoading) return <p>Loading task...</p>
  if (error) return <p className="text-red-500">{error}</p>

  // หากไม่มี Task
  if (!task) {
    return <p>Task not found.</p>
  }

  return (
    <li
      className={`p-4 rounded-lg shadow-md flex flex-col ${
        task.isCompleted ? 'bg-green-100' : 'bg-base-100'
      }`}
    >
      <h3
        className={`text-xl font-bold flex justify-between items-center ${
          task.isCompleted ? 'line-through text-gray-500' : ''
        }`}
      >
        {task.title}
        <span className={`badge ${getPriorityBadge(task.priority)}`}>
          {task.priority}
        </span>
      </h3>
      {task.description && (
        <p className={`mt-2 ${task.isCompleted ? 'text-gray-500' : ''}`}>
          {task.description}
        </p>
      )}
      <div className="flex gap-4 mt-4">
        <button
          onClick={handleToggleComplete}
          className="btn btn-sm btn-info"
          disabled={isProcessing}
        >
          {isProcessing
            ? 'Processing...'
            : task.isCompleted
            ? 'Mark Incomplete'
            : 'Mark Complete'}
        </button>
        <button
          onClick={handleDelete}
          className="btn btn-sm btn-error"
          disabled={isProcessing}
        >
          {isProcessing ? 'Processing...' : 'Delete'}
        </button>
      </div>
    </li>
  )
}

TaskItem.propTypes = {
  taskId: PropTypes.string.isRequired,
  onToggleComplete: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
}

export default TaskItem
