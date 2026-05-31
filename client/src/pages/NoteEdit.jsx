import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { FiSave, FiArrowLeft } from 'react-icons/fi'
import { getNote, createNote, updateNote } from '../services/api'
import TagBadge from '../components/TagBadge'

function NoteEdit() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = Boolean(id)

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [tags, setTags] = useState([])
  const [tagInput, setTagInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(isEdit)

  useEffect(() => {
    if (isEdit) {
      fetchNote()
    }
  }, [id])

  const fetchNote = async () => {
    try {
      setFetching(true)
      const res = await getNote(id)
      setTitle(res.data.title || '')
      setContent(res.data.content || '')
      setTags(res.data.tags || [])
    } catch (err) {
      toast.error('Failed to load note')
      navigate('/dashboard')
    } finally {
      setFetching(false)
    }
  }

  const handleAddTag = (e) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault()
      const newTag = tagInput.trim().toLowerCase()
      if (!tags.includes(newTag)) {
        setTags(prev => [...prev, newTag])
      }
      setTagInput('')
    }
  }

  const handleRemoveTag = (tagToRemove) => {
    setTags(prev => prev.filter(t => t !== tagToRemove))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!title.trim()) {
      toast.error('Please enter a title')
      return
    }

    setLoading(true)
    try {
      const data = {
        title: title.trim(),
        content: content.trim(),
        tags
      }

      let res
      if (isEdit) {
        res = await updateNote(id, data)
        toast.success('Note updated! ✅')
      } else {
        res = await createNote(data)
        toast.success('Note created! 🎉')
      }

      const noteId = res.data._id || id
      navigate(`/note/${noteId}`)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save note')
    } finally {
      setLoading(false)
    }
  }

  if (fetching) {
    return (
      <div className="note-edit">
        <div className="skeleton skeleton-title" style={{ width: '60%', height: '40px' }} />
        <div style={{ marginTop: '24px' }}>
          <div className="skeleton" style={{ height: '400px', borderRadius: 'var(--radius-md)' }} />
        </div>
      </div>
    )
  }

  return (
    <div className="note-edit">
      <div className="note-edit-header">
        <h1>{isEdit ? 'Edit Note' : 'New Note'}</h1>
        <div className="note-edit-actions">
          <button
            className="btn-cancel"
            onClick={() => navigate(isEdit ? `/note/${id}` : '/dashboard')}
          >
            <FiArrowLeft size={15} style={{ marginRight: '6px' }} />
            Cancel
          </button>
          <button
            className="btn-save"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="btn-spinner" style={{
                  width: '16px', height: '16px',
                  border: '2px solid rgba(255,255,255,0.3)',
                  borderTopColor: '#fff',
                  borderRadius: '50%',
                  animation: 'spin 0.6s linear infinite',
                  display: 'inline-block'
                }} />
                Saving...
              </>
            ) : (
              <>
                <FiSave size={15} />
                {isEdit ? 'Update' : 'Create'}
              </>
            )}
          </button>
        </div>
      </div>

      <form className="note-edit-form" onSubmit={handleSubmit}>
        <input
          className="title-input"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Give your note a title..."
          autoFocus
        />

        <textarea
          className="content-textarea"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your note here... (Markdown supported)"
        />

        <div className="tags-input-container">
          <label>Tags</label>
          <div className="tags-input-wrapper">
            {tags.map((tag, i) => (
              <TagBadge key={i} tag={tag} onRemove={handleRemoveTag} />
            ))}
            <input
              className="tags-input"
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleAddTag}
              placeholder={tags.length === 0 ? 'Type a tag and press Enter...' : 'Add another...'}
            />
          </div>
        </div>
      </form>
    </div>
  )
}

export default NoteEdit
