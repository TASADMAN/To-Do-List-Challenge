import React, { useState, useEffect } from 'react'
import { fetchHistory } from '../utils/api'
import Header from '../components/Header'
import { useNavigate } from 'react-router-dom'
import ToggleThemes from '../components/ToggleThemes'

const History = () => {
  const [history, setHistory] = useState([])
  const [totalCoins, setTotalCoins] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(5)
  const token = localStorage.getItem('token')
  const navigate = useNavigate()

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const data = await fetchHistory(token)
        setHistory(data)

        const total = data.reduce((acc, item) => acc + (item.coins || 0), 0)
        setTotalCoins(total > 100 ? total % 100 : total)
      } catch (error) {
        console.error('Failed to fetch history:', error.message)
      }
    }
    loadHistory()
  }, [token])
  //คำนวณเปอร์เซ็นต์ ที่ทำรายการ
  const progress = Math.min((totalCoins / 100) * 100, 100)

  // จัดการ pagination
  const LastItem = currentPage * itemsPerPage
  const FirstItem = LastItem - itemsPerPage
  const currentItems = history.slice(FirstItem, LastItem)

  const totalPages = Math.ceil(history.length / itemsPerPage)

  const handleLogout = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    navigate('/login')
  }

  return (
    <div className="todo-app h-screen p-8 mx-auto max-w-6xl">
      <Header handleLogout={handleLogout} />
      <ToggleThemes />
      <h1 className="text-3xl font-bold mb-6">Task History</h1>
      <p className="text-lg mb-4">
        Total Coins: <strong>{totalCoins}</strong>/100
      </p>

      <div className="mb-6">
        <progress
          className="progress progress-success w-full"
          value={progress}
          max="100"
        ></progress>

        <p className="text-center mt-2">
          {progress.toFixed(0)}% of 100 Coins 🏆
        </p>

        {progress === 100 && (
          <p className="text-green-500 font-bold text-center mt-4">
            🎉 Congratulations! You've reached 100 coins! 🎉
          </p>
        )}
      </div>

      {currentItems.length > 0 ? (
        <div>
          <table className="table w-full mb-4">
            <thead>
              <tr>
                <th className="text-lg ">Title</th>
                <th className="text-lg ">Priority</th>
                <th className="text-lg ">Completed At</th>
                <th className="text-lg ">Coins</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((item, index) => (
                <tr key={index}>
                  <td className="font-bold">{item.title}</td>
                  <td className="font-bold">{item.priority}</td>
                  <td className="font-bold">
                    {item.completedAt
                      ? new Date(item.completedAt).toLocaleString()
                      : '✅'}
                  </td>
                  <td className="font-bold">
                    {item.coins}
                    <span className=" flex flex-col justify-around text-xl">
                      🏅
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="join  flex justify-center items-center pb-20">
            {Array.from({ length: totalPages }, (_, index) => (
              <input
                key={index + 1}
                className={`join-item btn btn-square ${
                  currentPage === index + 1 ? 'btn-active' : ''
                }`}
                type="radio"
                name="pagination"
                aria-label={` ${index + 1}`}
                onClick={() => setCurrentPage(index + 1)}
              />
            ))}
          </div>
        </div>
      ) : (
        <p className="text-center">No completed tasks found.</p>
      )}
    </div>
  )
}

export default History
