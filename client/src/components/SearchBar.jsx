import { useState, useEffect, useRef } from 'react'
import { FiSearch, FiX } from 'react-icons/fi'

function SearchBar({ value, onChange, onSearch, placeholder = 'Search notes...' }) {
  const [localValue, setLocalValue] = useState(value || '')
  const debounceRef = useRef(null)

  useEffect(() => {
    setLocalValue(value || '')
  }, [value])

  const handleChange = (e) => {
    const val = e.target.value
    setLocalValue(val)
    if (onChange) onChange(val)

    // Debounced search
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      if (onSearch) onSearch(val)
    }, 300)
  }

  const handleClear = () => {
    setLocalValue('')
    if (onChange) onChange('')
    if (onSearch) onSearch('')
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      if (debounceRef.current) clearTimeout(debounceRef.current)
      if (onSearch) onSearch(localValue)
    }
  }

  return (
    <div className="search-bar">
      <FiSearch className="search-icon" />
      <input
        type="text"
        value={localValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        aria-label="Search notes"
      />
      {localValue && (
        <button className="search-clear" onClick={handleClear} aria-label="Clear search">
          <FiX />
        </button>
      )}
    </div>
  )
}

export default SearchBar
