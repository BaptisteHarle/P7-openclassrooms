import React from 'react';

function Input({
  type,
  label,
  placeholder,
  onChange,
  error,
}) {
  return (
    <div className="input">
      <label>{label}</label>
      <input
        placeholder={placeholder}
        type={type || 'text'}
        className={error && 'error'}
        onChange={(e) => onChange(e.target.value)} />
      {error && (
        <div className="error-container">
          <small>{error}</small>
        </div>
      )}
    </div>
  );
}

export default Input;
