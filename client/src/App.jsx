import { Routes, Route, Navigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import './App.css'

import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import NoteView from './pages/NoteView'
import NoteEdit from './pages/NoteEdit'
import { useAuth } from './context/AuthContext'

function App() {
  const { isAuthenticated } = useAuth()

  return (
    <div className="app">
      <Navbar />
      <main className="main-content">
        <Routes>
          {/* Public landing page */}
          <Route path="/" element={<Landing />} />

          {/* Auth pages — redirect to dashboard if already logged in */}
          <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />} />
          <Route path="/signup" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Signup />} />

          {/* Protected app routes */}
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/note/new" element={<ProtectedRoute><NoteEdit /></ProtectedRoute>} />
          <Route path="/note/:id" element={<ProtectedRoute><NoteView /></ProtectedRoute>} />
          <Route path="/note/:id/edit" element={<ProtectedRoute><NoteEdit /></ProtectedRoute>} />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        toastClassName="custom-toast"
      />
    </div>
  )
}

export default App
