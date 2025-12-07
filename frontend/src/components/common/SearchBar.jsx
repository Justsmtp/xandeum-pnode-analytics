// frontend/src/components/common/SearchBar.jsx
import React from 'react';
import './SearchBar.css';

const SearchBar = ({ value, onChange, placeholder = 'Search pNodes...' }) => {
  return (
    <div className="search-bar">
      <span className="search-icon">🔍</span>
      <input
        type="text"
        className="search-input"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {value && (
        <button className="search-clear" onClick={() => onChange('')}>
          ✕
        </button>
      )}
    </div>
  );
};

export default SearchBar;