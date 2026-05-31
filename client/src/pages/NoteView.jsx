import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import ReactMarkdown from 'react-markdown'
import {
  FiArrowLeft, FiEdit2, FiStar, FiZap, FiTag,
  FiTrash2, FiCalendar, FiFile, FiClock
} from 'react-icons/fi'
import {
  getNote, togglePin, deleteNote, summarizeNote, generateTags
} from '../services/api'
import AiPanel from '../components/AiPanel'
import TagBadge from '../components/TagBadge'

function NoteView() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [note, setNote] = useState(null)
  const [loading, setLoading] = useState(true)
  const [aiLoading, setAiLoading] = useState(false)
  const [showSummary, setShowSummary] = useState(false)
  const [showPdfText, setShowPdfText] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState(false)

  useEffect(() => {
    fetchNote()
  }, [id])

  const fetchNote = async () => {
    try {
      setLoading(true)
      const res = await getNote(id)
      setNote(res.data)
      if (res.data.summary) setShowSummary(true)
    } catch (err) {
      toast.error('Failed to load note')
      navigate('/dashboard')
    } finally {
      setLoading(false)
    }
  }

  const handlePin = async () => {
    try {
      const res = await togglePin(id)
      setNote(prev => ({ ...prev, isPinned: res.data.isPinned }))
      toast.success(res.data.isPinned ? 'Note pinned ⭐' : 'Note unpinned')
    } catch (err) {
      toast.error('Failed to toggle pin')
    }
  }

  const handleSummarize = async () => {
    try {
      setAiLoading(true)
      setShowSummary(true)
      const res = await summarizeNote(id)
      setNote(prev => ({ ...prev, summary: res.data.summary }))
      toast.success('Summary generated! ✨')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to generate summary')
    } finally {
      setAiLoading(false)
    }
  }

  const handleAutoTag = async () => {
    try {
      setAiLoading(true)
      const res = await generateTags(id)
      setNote(prev => ({ ...prev, tags: res.data.tags }))
      toast.success('Tags generated! 🏷️')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to generate tags')
    } finally {
      setAiLoading(false)
    }
  }

  const handleDelete = async () => {
    try {
      await deleteNote(id)
      toast.success('Note deleted')
      navigate('/dashboard')
    } catch (err) {
      toast.error('Failed to delete note')
    }
  }

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const formatTime = (dateStr) => {
    return new Date(dateStr).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="note-view">
        <div className="skeleton skeleton-title" style={{ width: '40%', marginBottom: '24px' }} />
        <div className="skeleton skeleton-title" style={{ width: '80%' }} />
        <div style={{ marginTop: '24px' }}>
          <div className="skeleton skeleton-text" />
          <div className="skeleton skeleton-text" />
          <div className="skeleton skeleton-text" />
          <div className="skeleton skeleton-text" style={{ width: '70%' }} />
        </div>
      </div>
    )
  }

  if (!note) return null

  return (
    <div className="note-view">
      {/* Back Button */}
      <button className="note-view-back" onClick={() => navigate('/dashboard')}>
        <FiArrowLeft />
        Back to Dashboard
      </button>

      {/* Header */}
      <div className="note-view-header">
        <h1 className="note-view-title">{note.title || 'Untitled Note'}</h1>
        <div className="note-view-meta">
          <span>
            <FiCalendar size={14} />
            {formatDate(note.createdAt)}
          </span>
          {note.updatedAt !== note.createdAt && (
            <span>
              <FiClock size={14} />
              Updated {formatTime(note.updatedAt)}
            </span>
          )}
          {note.isPdf && (
            <span className="pdf-badge">
              <FiFile size={10} />
              PDF
            </span>
          )}
          {note.isPinned && (
            <span style={{ color: 'var(--pin-color)' }}>
              <FiStar size={14} fill="currentColor" />
              Pinned
            </span>
          )}
        </div>
      </div>

      {/* Tags */}
      {note.tags && note.tags.length > 0 && (
        <div className="note-view-tags">
          {note.tags.map((tag, i) => (
            <TagBadge key={i} tag={tag} />
          ))}
        </div>
      )}

      {/* Action Buttons */}
      <div className="note-actions">
        <button className="btn-action edit" onClick={() => navigate(`/note/${id}/edit`)}>
          <FiEdit2 size={15} />
          Edit
        </button>
        <button
          className={`btn-action pin ${note.isPinned ? 'active' : ''}`}
          onClick={handlePin}
        >
          <FiStar size={15} fill={note.isPinned ? 'currentColor' : 'none'} />
          {note.isPinned ? 'Unpin' : 'Pin'}
        </button>
        <button
          className="btn-action ai"
          onClick={handleSummarize}
          disabled={aiLoading}
        >
          <FiZap size={15} />
          {note.summary ? 'Re-summarize' : 'Summarize'}
        </button>
        <button
          className="btn-action ai"
          onClick={handleAutoTag}
          disabled={aiLoading}
        >
          <FiTag size={15} />
          Auto-Tag
        </button>
        <button className="btn-action delete" onClick={() => setDeleteConfirm(true)}>
          <FiTrash2 size={15} />
          Delete
        </button>
      </div>

      {/* AI Summary Panel */}
      {showSummary && (
        <AiPanel
          summary={note.summary}
          loading={aiLoading}
          onClose={() => setShowSummary(false)}
        />
      )}

      {/* PDF Text */}
      {note.isPdf && note.pdfText && (
        <div className="pdf-text-block">
          <h3>
            <FiFile />
            <span>Extracted PDF Text</span>
            <button
              className="btn-icon"
              onClick={() => setShowPdfText(!showPdfText)}
              style={{ marginLeft: 'auto' }}
            >
              {showPdfText ? 'Hide' : 'Show'}
            </button>
          </h3>
          {showPdfText && (
            <div className="pdf-text-content">
              {note.pdfText}
            </div>
          )}
        </div>
      )}

      {/* Content */}
      <div className="note-view-content">
        <ReactMarkdown>{note.content || ''}</ReactMarkdown>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="modal-overlay" onClick={() => setDeleteConfirm(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="confirm-dialog">
              <h3>Delete "{note.title}"?</h3>
              <p>This action cannot be undone. The note will be permanently deleted.</p>
              <div className="confirm-actions">
                <button className="btn-confirm-cancel" onClick={() => setDeleteConfirm(false)}>
                  Cancel
                </button>
                <button className="btn-confirm-delete" onClick={handleDelete}>
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default NoteView
