import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FiMenu, FiX, FiLogOut, FiUser } from 'react-icons/fi'
import { useAuth } from '../context/AuthContext'
import ThemeToggle from './ThemeToggle'

function Navbar() {
  const { user, isAuthenticated, logout } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
    setMobileOpen(false)
  }

  const closeMobile = () => setMobileOpen(false)

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-logo">
          <span className="logo-emoji">✨</span>
          <span className="logo-text">NoteGPT</span>
        </Link>

        {/* Desktop Links */}
        <div className="navbar-links">
          {!isAuthenticated && (
            <>
              <a href="/#features" className="navbar-link">Features</a>
              <a href="/#how-it-works" className="navbar-link">How it works</a>
              <a href="/#about" className="navbar-link">About</a>
            </>
          )}
          <ThemeToggle />
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className="navbar-link">
                Dashboard
              </Link>
              <div className="navbar-user">
                <FiUser />
                <span>{user?.name || 'User'}</span>
              </div>
              <button className="btn-logout" onClick={handleLogout}>
                <FiLogOut />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="navbar-link">Sign in</Link>
              <Link to="/signup" className="btn-nav-cta">Get started</Link>
            </>
          )}
        </div>

        {/* Mobile controls: Theme toggle + Hamburger */}
        <div className="navbar-mobile-controls">
          <ThemeToggle />
          <button
            className="navbar-hamburger"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`navbar-mobile ${mobileOpen ? 'open' : ''}`}>
        {!isAuthenticated && (
          <>
            <a href="/#features" className="navbar-link" onClick={closeMobile}>Features</a>
            <a href="/#how-it-works" className="navbar-link" onClick={closeMobile}>How it works</a>
            <a href="/#about" className="navbar-link" onClick={closeMobile}>About</a>
          </>
        )}
        {isAuthenticated ? (
          <>
            <Link to="/dashboard" className="navbar-link" onClick={closeMobile}>
              Dashboard
            </Link>
            <div className="navbar-user">
              <FiUser />
              <span>{user?.name || 'User'}</span>
            </div>
            <button className="btn-logout" onClick={handleLogout}>
              <FiLogOut />
              <span>Logout</span>
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="navbar-link" onClick={closeMobile}>Sign in</Link>
            <Link to="/signup" className="btn-nav-cta" onClick={closeMobile}>Get started</Link>
          </>
        )}
      </div>
    </nav>
  )
}

export default Navbar
