import { useNavigate } from 'react-router-dom'
import { FiStar, FiFile } from 'react-icons/fi'
import TagBadge from './TagBadge'

function NoteCard({ note, onPin, onDelete, index = 0 }) {
  const navigate = useNavigate()

  const handleClick = () => {
    navigate(`/note/${note._id}`)
  }

  const handlePin = (e) => {
    e.stopPropagation()
    if (onPin) onPin(note._id)
  }

  const formatDate = (dateStr) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const getContentPreview = () => {
    if (note.content) return note.content
    if (note.pdfText) return note.pdfText.substring(0, 200)
    return 'No content'
  }

  return (
    <div
      className={`note-card ${note.isPinned ? 'pinned' : ''}`}
      onClick={handleClick}
      style={{ animationDelay: `${index * 60}ms` }}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && handleClick()}
    >
      <div className="note-card-header">
        <h3 className="note-card-title">{note.title || 'Untitled Note'}</h3>
        <button
          className={`note-card-pin ${note.isPinned ? 'active' : ''}`}
          onClick={handlePin}
          aria-label={note.isPinned ? 'Unpin note' : 'Pin note'}
          title={note.isPinned ? 'Unpin' : 'Pin'}
        >
          <FiStar fill={note.isPinned ? 'currentColor' : 'none'} />
        </button>
      </div>

      <p className="note-card-content">{getContentPreview()}</p>

      <div className="note-card-footer">
        <div className="note-card-tags">
          {note.tags && note.tags.slice(0, 3).map((tag, i) => (
            <TagBadge key={i} tag={tag} />
          ))}
          {note.tags && note.tags.length > 3 && (
            <span className="tag-badge" style={{ opacity: 0.6 }}>
              +{note.tags.length - 3}
            </span>
          )}
        </div>
        <div className="note-card-meta">
          {note.isPdf && (
            <span className="pdf-badge">
              <FiFile size={10} />
              PDF
            </span>
          )}
          <span className="note-card-date">
            {formatDate(note.updatedAt || note.createdAt)}
          </span>
        </div>
      </div>
    </div>
  )
}

export default NoteCard
