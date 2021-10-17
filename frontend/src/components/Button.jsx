import React from 'react';
import { Spinner } from 'react-bootstrap';

function Button({ label, loading, bgColor, color, onPress, width, marginRight, marginTop, disabled }) {
  return (
    <button
      className="btn"
      style={{
        backgroundColor: bgColor,
        color, marginRight:
          marginRight || 'unset',
        width: width || 'unset',
        marginTop: marginTop || 'unset',
      }}
      onClick={onPress || (() => { })}
      disabled={disabled || loading}>
      {loading ? (
        <Spinner size="sm" animation="border" style={{ color }} role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      ) : `${label}`}
    </button>
  );
}

export default Button;
