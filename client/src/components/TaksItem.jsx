const TaskItem = ({ task, onToggleComplete, onDelete }) => {
  return (
    <li
      className={`p-4 rounded-lg shadow-md ${
        task.completed ? 'bg-green-100' : 'bg-base-100'
      }`}
    >
      <h3 className="text-xl font-bold">
        {task.title}{' '}
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
      </h3>
      <p>{task.description}</p>
      <div className="flex gap-4 mt-4">
        <button
          onClick={() => onToggleComplete(task.id)}
          className="btn btn-sm btn-info"
        >
          {task.completed ? 'Mark Incomplete' : 'Mark Complete'}
        </button>
        <button
          onClick={() => onDelete(task.id)}
          className="btn btn-sm btn-error"
        >
          Delete
        </button>
      </div>
    </li>
  )
}

export default TaskItem
