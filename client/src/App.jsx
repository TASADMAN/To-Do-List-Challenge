import { Routes, Route } from 'react-router-dom'
import { Todo, Login, Register, Error } from './pages'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import History from './pages/History'

const App = () => {
  return (
    <>
      <ToastContainer position="top-right" autoClose={2000} />

      <Routes>
        <Route path="/" element={<Todo />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="history" element={<History />} />
        <Route path="*" element={<Error />} />
      </Routes>
    </>
  )
}

export default App
