import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'

const Header = () => {
  const [user, setUser] = useState(null)

  // ดึงข้อมูล user จาก localStorage
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'))
    if (storedUser) {
      setUser(storedUser)
    }
  }, [])

  const handleLogout = () => {
    setUser(null)
    localStorage.removeItem('user') // ลบข้อมูล user จาก localStorage
    console.log('User logged out')
  }

  return (
    <header className="bg-base-200 shadow-md py-4 rounded-2xl mb-4">
      <div className="container mx-auto flex justify-between items-center px-4">
        <Link to="/" className="text-2xl font-bold text-primary">
          To-Do App
        </Link>

        {user ? (
          <div className="flex items-center gap-4 p-3 rounded-lg ">
            <p className="text-sm font-medium text-base-500">
              👋 Hello,{' '}
              <span className="font-semibold text-primary">
                {user.username || 'User'}
              </span>
            </p>
            <button
              className="btn btn-sm btn-primary  shadow-md"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="flex gap-4">
            <Link to="/login" className="btn btn-sm btn-outline btn-secondary">
              Sign in
            </Link>
            <Link to="/register" className="btn btn-sm btn-primary">
              Create Account
            </Link>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header
