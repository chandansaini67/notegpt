import { FiX } from 'react-icons/fi'

function TagBadge({ tag, onRemove }) {
  return (
    <span className="tag-badge">
      {tag}
      {onRemove && (
        <button
          className="tag-remove"
          onClick={(e) => {
            e.stopPropagation()
            onRemove(tag)
          }}
          aria-label={`Remove tag: ${tag}`}
        >
          <FiX size={12} />
        </button>
      )}
    </span>
  )
}

export default TagBadge
