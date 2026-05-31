import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import {
  FiPlus, FiFileText, FiFile, FiStar, FiZap,
  FiUploadCloud, FiX
} from 'react-icons/fi'
import {
  getNotes, searchNotes, togglePin, deleteNote, uploadPdf
} from '../services/api'
import { useAuth } from '../context/AuthContext'
import NoteCard from '../components/NoteCard'
import SearchBar from '../components/SearchBar'
import PdfUploader from '../components/PdfUploader'

function Dashboard() {
  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [showUploader, setShowUploader] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null)
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    fetchNotes()
  }, [])

  const fetchNotes = async () => {
    try {
      setLoading(true)
      const res = await getNotes()
      setNotes(res.data)
    } catch (err) {
      toast.error('Failed to load notes')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async (query) => {
    setSearchQuery(query)
    try {
      if (query.trim()) {
        const res = await searchNotes(query)
        setNotes(res.data)
      } else {
        const res = await getNotes()
        setNotes(res.data)
      }
    } catch (err) {
      toast.error('Search failed')
    }
  }

  const handlePin = async (id) => {
    try {
      const res = await togglePin(id)
      setNotes(prev =>
        prev.map(n => n._id === id ? { ...n, isPinned: res.data.isPinned } : n)
      )
      toast.success(res.data.isPinned ? 'Note pinned ⭐' : 'Note unpinned')
    } catch (err) {
      toast.error('Failed to toggle pin')
    }
  }

  const handleDelete = async (id) => {
    try {
      await deleteNote(id)
      setNotes(prev => prev.filter(n => n._id !== id))
      toast.success('Note deleted')
      setShowDeleteConfirm(null)
    } catch (err) {
      toast.error('Failed to delete note')
    }
  }

  const handleUpload = async (formData) => {
    const res = await uploadPdf(formData)
    toast.success('PDF uploaded successfully! 📄')
    setShowUploader(false)
    fetchNotes()
    return res
  }

  const pinnedNotes = notes.filter(n => n.isPinned)
  const unpinnedNotes = notes.filter(n => !n.isPinned)
  const pdfCount = notes.filter(n => n.isPdf).length
  const summaryCount = notes.filter(n => n.summary).length

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 17) return 'Good afternoon'
    return 'Good evening'
  }

  return (
    <div className="dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <h1>{getGreeting()}, {user?.name?.split(' ')[0] || 'there'} 👋</h1>
        <p>Here's what's happening with your notes</p>
      </div>

      {/* Stats */}
      <div className="stats-bar stagger">
        <div className="stat-card">
          <div className="stat-icon indigo">
            <FiFileText />
          </div>
          <div className="stat-info">
            <span className="stat-number">{notes.length}</span>
            <span className="stat-label">Total Notes</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon violet">
            <FiFile />
          </div>
          <div className="stat-info">
            <span className="stat-number">{pdfCount}</span>
            <span className="stat-label">PDFs</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon amber">
            <FiStar />
          </div>
          <div className="stat-info">
            <span className="stat-number">{pinnedNotes.length}</span>
            <span className="stat-label">Pinned</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon emerald">
            <FiZap />
          </div>
          <div className="stat-info">
            <span className="stat-number">{summaryCount}</span>
            <span className="stat-label">AI Summaries</span>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="dashboard-toolbar">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          onSearch={handleSearch}
          placeholder="Search notes by title, content, or tags..."
        />
        <button className="btn-upload" onClick={() => setShowUploader(true)}>
          <FiUploadCloud />
          Upload PDF
        </button>
      </div>

      {/* Loading Skeleton */}
      {loading ? (
        <div className="notes-grid">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="skeleton skeleton-card" />
          ))}
        </div>
      ) : notes.length === 0 ? (
        /* Empty State */
        <div className="empty-state">
          <div className="empty-icon">📝</div>
          <h3>{searchQuery ? 'No notes found' : 'No notes yet'}</h3>
          <p>
            {searchQuery
              ? `No notes match "${searchQuery}". Try a different search.`
              : 'Create your first note or upload a PDF to get started with AI-powered note-taking.'
            }
          </p>
          {!searchQuery && (
            <button className="btn-empty" onClick={() => navigate('/note/new')}>
              <FiPlus />
              Create Your First Note
            </button>
          )}
        </div>
      ) : (
        <>
          {/* Pinned Section */}
          {pinnedNotes.length > 0 && (
            <div className="notes-section">
              <div className="section-header pinned-header">
                <FiStar className="section-icon" style={{ color: 'var(--pin-color)' }} />
                <h2>Pinned</h2>
                <span className="section-count">{pinnedNotes.length}</span>
              </div>
              <div className="notes-grid stagger">
                {pinnedNotes.map((note, i) => (
                  <NoteCard
                    key={note._id}
                    note={note}
                    index={i}
                    onPin={handlePin}
                    onDelete={(id) => setShowDeleteConfirm(id)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* All Notes Section */}
          <div className="notes-section">
            <div className="section-header">
              <FiFileText className="section-icon" style={{ color: 'var(--accent-primary)' }} />
              <h2>{pinnedNotes.length > 0 ? 'All Notes' : 'Your Notes'}</h2>
              <span className="section-count">{unpinnedNotes.length}</span>
            </div>
            {unpinnedNotes.length > 0 ? (
              <div className="notes-grid stagger">
                {unpinnedNotes.map((note, i) => (
                  <NoteCard
                    key={note._id}
                    note={note}
                    index={i}
                    onPin={handlePin}
                    onDelete={(id) => setShowDeleteConfirm(id)}
                  />
                ))}
              </div>
            ) : (
              pinnedNotes.length > 0 && (
                <p style={{ color: 'var(--text-muted)', padding: '20px 0' }}>
                  All your notes are pinned! 📌
                </p>
              )
            )}
          </div>
        </>
      )}

      {/* FAB - New Note */}
      <button
        className="fab"
        onClick={() => navigate('/note/new')}
        title="Create new note"
        aria-label="Create new note"
      >
        <FiPlus />
      </button>

      {/* PDF Upload Modal */}
      {showUploader && (
        <div className="modal-overlay" onClick={() => setShowUploader(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Upload PDF</h2>
              <button className="modal-close" onClick={() => setShowUploader(false)}>
                <FiX />
              </button>
            </div>
            <PdfUploader onUpload={handleUpload} />
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="modal-overlay" onClick={() => setShowDeleteConfirm(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="confirm-dialog">
              <h3>Delete Note?</h3>
              <p>This action cannot be undone. The note will be permanently deleted.</p>
              <div className="confirm-actions">
                <button className="btn-confirm-cancel" onClick={() => setShowDeleteConfirm(null)}>
                  Cancel
                </button>
                <button className="btn-confirm-delete" onClick={() => handleDelete(showDeleteConfirm)}>
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="dashboard-footer">
        <span className="footer-brand">NoteGPT</span> v1.0 — Founded by Chandan Saini • Built with ❤️
      </div>
    </div>
  )
}

export default Dashboard
