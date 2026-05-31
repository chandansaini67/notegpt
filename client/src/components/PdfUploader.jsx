import { useState, useRef } from 'react'
import { FiUploadCloud, FiFile, FiCheck } from 'react-icons/fi'

function PdfUploader({ onUpload }) {
  const [status, setStatus] = useState('idle') // idle, dragover, uploading, success, error
  const [fileName, setFileName] = useState('')
  const [progress, setProgress] = useState(0)
  const [errorMsg, setErrorMsg] = useState('')
  const inputRef = useRef(null)

  const handleDragOver = (e) => {
    e.preventDefault()
    setStatus('dragover')
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setStatus('idle')
  }

  const handleDrop = (e) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) processFile(file)
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) processFile(file)
  }

  const processFile = async (file) => {
    // Validate PDF
    if (file.type !== 'application/pdf') {
      setStatus('error')
      setErrorMsg('Please upload a PDF file.')
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      setStatus('error')
      setErrorMsg('File size must be under 10MB.')
      return
    }

    setFileName(file.name)
    setStatus('uploading')
    setProgress(0)
    setErrorMsg('')

    // Simulate progress
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval)
          return 90
        }
        return prev + 10
      })
    }, 200)

    try {
      const formData = new FormData()
      formData.append('pdf', file)
      await onUpload(formData)
      clearInterval(progressInterval)
      setProgress(100)
      setStatus('success')
    } catch (err) {
      clearInterval(progressInterval)
      setStatus('error')
      setErrorMsg(err.response?.data?.message || 'Upload failed. Please try again.')
    }
  }

  const reset = () => {
    setStatus('idle')
    setFileName('')
    setProgress(0)
    setErrorMsg('')
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <div className="pdf-uploader">
      <div
        className={`upload-zone ${status === 'dragover' ? 'dragover' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => status === 'idle' && inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,application/pdf"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />

        {status === 'idle' || status === 'dragover' ? (
          <>
            <div className="upload-icon">
              <FiUploadCloud size={48} />
            </div>
            <h3>Drop your PDF here</h3>
            <p>or click to browse • Max 10MB</p>
          </>
        ) : status === 'uploading' ? (
          <>
            <div className="upload-icon">
              <FiFile size={48} />
            </div>
            <div className="upload-file-name">
              <FiFile size={14} />
              {fileName}
            </div>
            <div className="upload-progress">
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${progress}%` }} />
              </div>
            </div>
          </>
        ) : status === 'success' ? (
          <>
            <div className="upload-success">
              <FiCheck size={20} />
              PDF uploaded successfully!
            </div>
            <div className="upload-file-name">
              <FiFile size={14} />
              {fileName}
            </div>
          </>
        ) : (
          <>
            <div className="upload-icon" style={{ color: 'var(--danger)' }}>
              <FiUploadCloud size={48} />
            </div>
            <p className="upload-error">{errorMsg}</p>
          </>
        )}
      </div>

      {(status === 'success' || status === 'error') && (
        <button
          className="btn-upload"
          onClick={reset}
          style={{ width: '100%', justifyContent: 'center', marginTop: '12px' }}
        >
          Upload Another
        </button>
      )}
    </div>
  )
}

export default PdfUploader
