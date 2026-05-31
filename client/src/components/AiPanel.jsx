import { FiZap, FiCopy, FiX, FiCheck } from 'react-icons/fi'
import { useState } from 'react'

function AiPanel({ summary, loading, onClose }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    if (!summary) return
    try {
      await navigator.clipboard.writeText(summary)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback
      const textArea = document.createElement('textarea')
      textArea.value = summary
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="ai-panel">
      <div className="ai-panel-header">
        <h3>
          <FiZap />
          AI Summary
        </h3>
        <div className="ai-panel-actions">
          {summary && (
            <button
              className="btn-icon"
              onClick={handleCopy}
              title={copied ? 'Copied!' : 'Copy to clipboard'}
            >
              {copied ? <FiCheck /> : <FiCopy />}
            </button>
          )}
          {onClose && (
            <button className="btn-icon" onClick={onClose} title="Close">
              <FiX />
            </button>
          )}
        </div>
      </div>

      <div className="ai-panel-content">
        {loading ? (
          <div className="ai-panel-loading">
            <div className="skeleton skeleton-text" />
            <div className="skeleton skeleton-text" />
            <div className="skeleton skeleton-text" />
            <div className="skeleton skeleton-text" style={{ width: '40%' }} />
          </div>
        ) : summary ? (
          <p>{summary}</p>
        ) : (
          <p style={{ color: 'var(--text-muted)' }}>No summary available.</p>
        )}
      </div>
    </div>
  )
}

export default AiPanel
