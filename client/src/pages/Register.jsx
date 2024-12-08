import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { register } from '../actions/userActions'

const Register = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  })
  const [state, setState] = useState({ success: null, error: null })
  const [isPending, setIsPending] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsPending(true)

    const result = await register(new FormData(e.target))
    setState(result)
    setIsPending(false)

    if (result.success) {
      localStorage.setItem('user', JSON.stringify(result.success.user))
      toast.success('Registration successful')
    } else if (result.error) {
      toast.error(result.error)
    }
  }

  useEffect(() => {
    if (state.success) {
      setTimeout(() => {
        navigate('/login')
      }, 2000)
    }
  }, [state.success])

  return (
    <section className="h-screen grid place-items-center">
      <form
        onSubmit={handleSubmit}
        className="card w-96 p-8 bg-base-100 shadow-lg flex flex-col gap-y-4"
      >
        <h4 className="text-center text-3xl font-bold">Register</h4>
        <div className="form-control">
          <label className="label">
            <span className="label-text">Username</span>
          </label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="input input-bordered"
            placeholder="Enter your username"
            required
          />
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text">Email</span>
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="input input-bordered"
            placeholder="Enter your email"
            required
          />
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text">Password</span>
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="input input-bordered"
            placeholder="Enter your password"
            required
          />
        </div>
        <button disabled={isPending} className="btn btn-secondary btn-block">
          {isPending ? 'Registering...' : 'Register'}
        </button>
        <p className="text-center">
          Already have an account?{' '}
          <Link to="/login" className="link link-hover link-primary">
            Login
          </Link>
        </p>
      </form>
    </section>
  )
}

export default Register
