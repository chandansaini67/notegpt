import { FiSun, FiMoon } from 'react-icons/fi'
import { useTheme } from '../context/ThemeContext'

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      <span className="theme-toggle-icon sun">
        <FiSun />
      </span>
      <span className="theme-toggle-icon moon">
        <FiMoon />
      </span>
    </button>
  )
}

export default ThemeToggle
