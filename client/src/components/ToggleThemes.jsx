import React, { useEffect, useState } from 'react'
import { BsMoonFill, BsSunFill } from 'react-icons/bs'

const ToggleThemes = () => {
  const [theme, setTheme] = useState('dracula')

  const handleTheme = () => {
    const newTheme = theme === 'retro' ? 'dracula' : 'retro'
    setTheme(newTheme)
    document.documentElement.setAttribute('data-theme', newTheme)
    localStorage.setItem('theme', newTheme)
  }

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'dracula'
    setTheme(savedTheme)
    document.documentElement.setAttribute('data-theme', savedTheme)
  }, [])

  return (
    <nav className="flex justify-end items-center">
      <div className="navbar-end">
        {/* THEME SETUP */}
        <label className="swap swap-rotate">
          <input type="checkbox" onClick={handleTheme} />
          {/* sun icon*/}
          <BsSunFill className="swap-on h-4 w-4" />
          {/* moon icon*/}
          <BsMoonFill className="swap-off h-4 w-4" />
        </label>
      </div>
    </nav>
  )
}

export default ToggleThemes
